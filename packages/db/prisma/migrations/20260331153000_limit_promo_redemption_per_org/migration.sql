WITH duplicate_redemptions AS (
  SELECT
    id,
    ROW_NUMBER() OVER (
      PARTITION BY promo_code_id, organization_id
      ORDER BY redeemed_at ASC, id ASC
    ) AS row_num
  FROM billing_promo_redemption
)
DELETE FROM billing_promo_redemption
WHERE id IN (
  SELECT id
  FROM duplicate_redemptions
  WHERE row_num > 1
);

CREATE UNIQUE INDEX "billing_promo_redemption_promo_code_id_organization_id_key"
  ON "billing_promo_redemption"("promo_code_id", "organization_id");
