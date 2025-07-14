-- Create enum types
CREATE TYPE user_role AS ENUM ('admin', 'vet', 'vet_tech');
CREATE TYPE case_status AS ENUM ('waiting', 'ready', 'in_consult', 'complete', 'cancelled');
CREATE TYPE triage_level AS ENUM ('green', 'yellow', 'red');
CREATE TYPE species_type AS ENUM ('dog', 'cat', 'bird', 'rabbit', 'other');
CREATE TYPE file_category AS ENUM ('xray', 'ultrasound', 'lab_results', 'photo', 'video', 'document', 'other');

-- Update users table with role
ALTER TABLE users 
ADD COLUMN role user_role DEFAULT 'vet_tech',
ADD COLUMN clinic_id UUID,
ADD COLUMN is_available BOOLEAN DEFAULT true,
ADD COLUMN license_number TEXT,
ADD COLUMN specializations TEXT[];

-- Create clinics table
CREATE TABLE clinics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    address TEXT,
    phone TEXT,
    email TEXT,
    timezone TEXT DEFAULT 'UTC',
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add foreign key to users
ALTER TABLE users 
ADD CONSTRAINT users_clinic_id_fkey 
FOREIGN KEY (clinic_id) REFERENCES clinics(id) ON DELETE SET NULL;

-- Create owners table
CREATE TABLE owners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT,
    phone TEXT NOT NULL,
    alternate_phone TEXT,
    address TEXT,
    emergency_contact_name TEXT,
    emergency_contact_phone TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create pets table
CREATE TABLE pets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES owners(id) ON DELETE CASCADE,
    clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    species species_type NOT NULL,
    breed TEXT,
    age_years INTEGER,
    age_months INTEGER,
    weight_kg DECIMAL(5,2),
    sex TEXT,
    is_neutered BOOLEAN DEFAULT false,
    microchip_id TEXT,
    medical_history TEXT,
    allergies TEXT[],
    current_medications TEXT[],
    photo_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create cases table
CREATE TABLE cases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
    pet_id UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
    assigned_vet_id UUID REFERENCES users(id) ON DELETE SET NULL,
    assigned_tech_id UUID REFERENCES users(id) ON DELETE SET NULL,
    status case_status DEFAULT 'waiting',
    triage_level triage_level,
    presenting_complaint TEXT NOT NULL,
    chief_concern TEXT,
    queue_position INTEGER,
    check_in_time TIMESTAMPTZ DEFAULT NOW(),
    consultation_start_time TIMESTAMPTZ,
    consultation_end_time TIMESTAMPTZ,
    video_room_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create vitals table
CREATE TABLE vitals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
    recorded_by_id UUID NOT NULL REFERENCES users(id),
    temperature_celsius DECIMAL(3,1),
    heart_rate INTEGER,
    respiratory_rate INTEGER,
    weight_kg DECIMAL(5,2),
    mucous_membrane_color TEXT,
    capillary_refill_time INTEGER, -- in seconds
    pain_scale INTEGER CHECK (pain_scale >= 0 AND pain_scale <= 10),
    blood_pressure_systolic INTEGER,
    blood_pressure_diastolic INTEGER,
    notes TEXT,
    recorded_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create case_files table
CREATE TABLE case_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
    uploaded_by_id UUID NOT NULL REFERENCES users(id),
    file_url TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_size INTEGER,
    file_type TEXT,
    category file_category,
    description TEXT,
    annotations JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create clinical_notes table
CREATE TABLE clinical_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES users(id),
    note_type TEXT NOT NULL, -- 'subjective', 'objective', 'assessment', 'plan'
    content TEXT NOT NULL,
    is_finalized BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create treatment_plans table
CREATE TABLE treatment_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
    created_by_id UUID NOT NULL REFERENCES users(id),
    medications JSONB DEFAULT '[]',
    procedures JSONB DEFAULT '[]',
    follow_up_instructions TEXT,
    discharge_instructions TEXT,
    estimated_cost_low DECIMAL(10,2),
    estimated_cost_high DECIMAL(10,2),
    is_approved BOOLEAN DEFAULT false,
    approved_by_id UUID REFERENCES users(id),
    approved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create audit_logs table
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID,
    changes JSONB,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_cases_clinic_status ON cases(clinic_id, status);
CREATE INDEX idx_cases_pet_id ON cases(pet_id);
CREATE INDEX idx_cases_assigned_vet ON cases(assigned_vet_id) WHERE assigned_vet_id IS NOT NULL;
CREATE INDEX idx_cases_triage_level ON cases(triage_level) WHERE triage_level IS NOT NULL;
CREATE INDEX idx_cases_check_in_time ON cases(check_in_time);
CREATE INDEX idx_pets_owner_id ON pets(owner_id);
CREATE INDEX idx_vitals_case_id ON vitals(case_id);
CREATE INDEX idx_case_files_case_id ON case_files(case_id);
CREATE INDEX idx_clinical_notes_case_id ON clinical_notes(case_id);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_clinics_updated_at BEFORE UPDATE ON clinics
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_owners_updated_at BEFORE UPDATE ON owners
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pets_updated_at BEFORE UPDATE ON pets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cases_updated_at BEFORE UPDATE ON cases
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clinical_notes_updated_at BEFORE UPDATE ON clinical_notes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_treatment_plans_updated_at BEFORE UPDATE ON treatment_plans
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();