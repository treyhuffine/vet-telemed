-- ✅ JWT function
CREATE OR REPLACE FUNCTION public.jwt_custom_claims(auth_payload JSONB)
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
    claims JSONB;
    user_id uuid;
BEGIN
    user_id := (auth_payload->>'user_id')::uuid;

    -- Extract existing claims or initialize if missing
    claims := auth_payload->'claims';
    IF claims IS NULL THEN
        claims := '{}'::jsonb;
    END IF;

    -- Add Hasura claims inside the JWT
    claims := jsonb_set(claims, '{https://hasura.io/jwt/claims}', 
        jsonb_build_object(
            'x-hasura-user-id', user_id,
            'x-hasura-default-role', 'user',
            'x-hasura-allowed-roles', ARRAY['user', 'anonymous']
        )
    );

    -- Inject the modified claims back into the auth_payload
    auth_payload := jsonb_set(auth_payload, '{claims}', claims);

    -- Return the modified auth_payload
    RETURN auth_payload;
END;
$$;
