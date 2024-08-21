CREATE TABLE doctor_profiles (
  id uuid default gen_random_uuid() primary key,
    name TEXT NOT NULL,
    education TEXT,
    background TEXT,
    specialization TEXT,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);


