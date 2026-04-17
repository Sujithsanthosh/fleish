import { useEffect, useState, useCallback, useRef } from 'react';
import { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface UseRealtimeOptions {
  table: string;
  schema?: string;
  filter?: string;
  onInsert?: (payload: any) => void;
  onUpdate?: (payload: any) => void;
  onDelete?: (payload: any) => void;
  enabled?: boolean;
}

/**
 * React hook for real-time Supabase subscriptions
 *
 * @example
 * const { data, loading, error } = useRealtime({
 *   table: 'orders',
 *   onInsert: (newOrder) => toast.success('New order received!'),
 *   onUpdate: (updatedOrder) => updateOrderInState(updatedOrder),
 * });
 */
export function useRealtime<T = any>({
  table,
  schema = 'public',
  filter,
  onInsert,
  onUpdate,
  onDelete,
  enabled = true,
}: UseRealtimeOptions) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);

  // Use refs to store callbacks to prevent re-subscriptions
  const onInsertRef = useRef(onInsert);
  const onUpdateRef = useRef(onUpdate);
  const onDeleteRef = useRef(onDelete);

  useEffect(() => {
    onInsertRef.current = onInsert;
    onUpdateRef.current = onUpdate;
    onDeleteRef.current = onDelete;
  }, [onInsert, onUpdate, onDelete]);

  // Fetch initial data
  useEffect(() => {
    if (!enabled || !supabase) return;

    const fetchData = async () => {
      if (!supabase) return;
      try {
        setLoading(true);
        let query = supabase.from(table).select('*');

        if (filter) {
          query = query.eq(filter.split('=')[0], filter.split('=')[1]);
        }

        const { data: result, error: err } = await query;

        if (err) throw err;
        setData(result || []);
        setError(null);
      } catch (err) {
        setError(err as Error);
        console.error(`Error fetching ${table}:`, err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [table, filter, enabled]);

  // Subscribe to real-time updates
  useEffect(() => {
    if (!enabled || !supabase) return;

    let isSubscribed = true;

    const subscription = supabase
      .channel(`${table}_realtime`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema,
          table,
          ...(filter ? { filter } : {}),
        },
        (payload) => {
          if (isSubscribed) {
            setData((prev) => [payload.new as T, ...prev]);
            onInsertRef.current?.(payload);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema,
          table,
          ...(filter ? { filter } : {}),
        },
        (payload) => {
          if (isSubscribed) {
            setData((prev) =>
              prev.map((item: any) =>
                item.id === payload.new.id ? payload.new : item
              )
            );
            onUpdateRef.current?.(payload);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema,
          table,
          ...(filter ? { filter } : {}),
        },
        (payload) => {
          if (isSubscribed) {
            setData((prev) => prev.filter((item: any) => item.id !== payload.old.id));
            onDeleteRef.current?.(payload);
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log(`✓ Subscribed to ${table} updates`);
        } else if (status === 'CHANNEL_ERROR') {
          console.error(`✗ Error subscribing to ${table}`);
        }
      });

    setChannel(subscription);

    // Cleanup
    return () => {
      isSubscribed = false;
      if (subscription && supabase) {
        supabase.removeChannel(subscription);
        console.log(`✓ Unsubscribed from ${table}`);
      }
    };
  }, [table, schema, filter, enabled]);

  return { data, loading, error, channel };
}

/**
 * Hook for single record real-time updates
 */
export function useRealtimeRecord<T = any>({
  table,
  id,
  schema = 'public',
  onUpdate,
  enabled = true,
}: {
  table: string;
  id: string | null;
  schema?: string;
  onUpdate?: (payload: any) => void;
  enabled?: boolean;
}) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch initial record
  useEffect(() => {
    if (!enabled || !id || !supabase) return;

    const fetchData = async () => {
      if (!supabase) return;
      try {
        setLoading(true);
        const { data: result, error: err } = await supabase
          .from(table)
          .select('*')
          .eq('id', id)
          .single();

        if (err) throw err;
        setData(result);
        setError(null);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [table, id, enabled]);

  // Subscribe to updates
  useEffect(() => {
    if (!enabled || !id || !supabase) return;

    const subscription = supabase
      .channel(`${table}_${id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema,
          table,
          filter: `id=eq.${id}`,
        },
        (payload) => {
          setData(payload.new as T);
          onUpdate?.(payload);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema,
          table,
          filter: `id=eq.${id}`,
        },
        () => {
          setData(null);
        }
      )
      .subscribe();

    return () => {
      if (subscription && supabase) {
        supabase.removeChannel(subscription);
      }
    };
  }, [table, id, schema, onUpdate, enabled]);

  return { data, loading, error };
}

/**
 * Hook for real-time count
 */
export function useRealtimeCount({
  table,
  filter,
  enabled = true,
}: {
  table: string;
  filter?: string;
  enabled?: boolean;
}) {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch initial count
  useEffect(() => {
    if (!enabled || !supabase) return;

    const fetchCount = async () => {
      if (!supabase) return;
      try {
        let query = supabase.from(table).select('*', { count: 'exact', head: true });

        if (filter) {
          query = query.eq(filter.split('=')[0], filter.split('=')[1]);
        }

        const { count: result, error } = await query;

        if (error) throw error;
        setCount(result || 0);
      } catch (err) {
        console.error(`Error counting ${table}:`, err);
      } finally {
        setLoading(false);
      }
    };

    fetchCount();
  }, [table, filter, enabled]);

  // Subscribe to changes
  useEffect(() => {
    if (!enabled || !supabase) return;

    const subscription = supabase
      .channel(`${table}_count`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table,
          ...(filter ? { filter } : {}),
        },
        async () => {
          if (!supabase) return;
          // Refetch count on any change
          let query = supabase.from(table).select('*', { count: 'exact', head: true });
          if (filter) {
            query = query.eq(filter.split('=')[0], filter.split('=')[1]);
          }
          const { count: result } = await query;
          setCount(result || 0);
        }
      )
      .subscribe();

    return () => {
      if (subscription && supabase) {
        supabase.removeChannel(subscription);
      }
    };
  }, [table, filter, enabled]);

  return { count, loading };
}
