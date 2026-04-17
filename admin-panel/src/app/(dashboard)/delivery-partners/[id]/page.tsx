import DeliveryPartnerClientPage from './page-client';

export function generateStaticParams() {
  return [{ id: 'dummy' }];
}

export default function Page() {
  return <DeliveryPartnerClientPage />;
}
