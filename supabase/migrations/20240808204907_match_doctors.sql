create or replace function match_doctors(
  embedding vector(384),
  match_threshold float
)
returns setof doctors
language plpgsql
as $$
#variable_conflict use_variable
begin
  return query
  select *
  from doctors
  where doctors.embedding <#> embedding < -match_threshold
	order by doctors.embedding <#> embedding;
end;
$$;
