-- Drop triggers
DROP TRIGGER IF EXISTS update_treatment_plans_updated_at ON treatment_plans;
DROP TRIGGER IF EXISTS update_clinical_notes_updated_at ON clinical_notes;
DROP TRIGGER IF EXISTS update_cases_updated_at ON cases;
DROP TRIGGER IF EXISTS update_pets_updated_at ON pets;
DROP TRIGGER IF EXISTS update_owners_updated_at ON owners;
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
DROP TRIGGER IF EXISTS update_clinics_updated_at ON clinics;

-- Drop function
DROP FUNCTION IF EXISTS update_updated_at_column();

-- Drop indexes
DROP INDEX IF EXISTS idx_audit_logs_created_at;
DROP INDEX IF EXISTS idx_audit_logs_user_id;
DROP INDEX IF EXISTS idx_clinical_notes_case_id;
DROP INDEX IF EXISTS idx_case_files_case_id;
DROP INDEX IF EXISTS idx_vitals_case_id;
DROP INDEX IF EXISTS idx_pets_owner_id;
DROP INDEX IF EXISTS idx_cases_check_in_time;
DROP INDEX IF EXISTS idx_cases_triage_level;
DROP INDEX IF EXISTS idx_cases_assigned_vet;
DROP INDEX IF EXISTS idx_cases_pet_id;
DROP INDEX IF EXISTS idx_cases_clinic_status;

-- Drop tables
DROP TABLE IF EXISTS audit_logs;
DROP TABLE IF EXISTS treatment_plans;
DROP TABLE IF EXISTS clinical_notes;
DROP TABLE IF EXISTS case_files;
DROP TABLE IF EXISTS vitals;
DROP TABLE IF EXISTS cases;
DROP TABLE IF EXISTS pets;
DROP TABLE IF EXISTS owners;

-- Remove columns from users table
ALTER TABLE users 
DROP CONSTRAINT IF EXISTS users_clinic_id_fkey,
DROP COLUMN IF EXISTS specializations,
DROP COLUMN IF EXISTS license_number,
DROP COLUMN IF EXISTS is_available,
DROP COLUMN IF EXISTS clinic_id,
DROP COLUMN IF EXISTS role;

-- Drop clinics table
DROP TABLE IF EXISTS clinics;

-- Drop enum types
DROP TYPE IF EXISTS file_category;
DROP TYPE IF EXISTS species_type;
DROP TYPE IF EXISTS triage_level;
DROP TYPE IF EXISTS case_status;
DROP TYPE IF EXISTS user_role;