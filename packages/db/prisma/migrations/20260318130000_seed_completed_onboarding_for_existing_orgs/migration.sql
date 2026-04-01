INSERT INTO "onboarding_state" (
    "id",
    "organization_id",
    "current_step",
    "agent_logs",
    "ngrok_tests_passed",
    "production_tests_passed",
    "completed_at",
    "created_at",
    "updated_at"
)
SELECT
    gen_random_uuid()::text,
    "id",
    5,
    '[]'::jsonb,
    true,
    true,
    NOW(),
    NOW(),
    NOW()
FROM "organization";
