-- Migration Fix Script
-- Run this first if you get "column does not exist" errors

-- Add career_id column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'job_applications' AND column_name = 'career_id') THEN
        ALTER TABLE job_applications ADD COLUMN career_id UUID;
    END IF;
END $$;

-- Add foreign key constraint (safe to run multiple times)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                   WHERE constraint_name = 'fk_job_applications_career') THEN
        ALTER TABLE job_applications 
        ADD CONSTRAINT fk_job_applications_career 
        FOREIGN KEY (career_id) REFERENCES careers(id) ON DELETE SET NULL;
    END IF;
END $$;

-- Create index if not exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_job_applications_career_id') THEN
        CREATE INDEX idx_job_applications_career_id ON job_applications(career_id);
    END IF;
END $$;
