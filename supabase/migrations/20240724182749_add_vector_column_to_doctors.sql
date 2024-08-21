create extension if not exists vector with schema extensions;

-- migrations/<timestamp>_add_embedding_vector_to_doctors.sql
ALTER TABLE doctors
ADD COLUMN embedding vector(384);
