-- Homes, members, bills and shares. Money is always whole cents (INTEGER).

CREATE TABLE homes (
  id   TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  CONSTRAINT chk_homes_name_not_blank CHECK (length(trim(name)) > 0)
);

CREATE TABLE members (
  id       TEXT PRIMARY KEY,
  home_id  TEXT NOT NULL,
  name     TEXT NOT NULL,
  -- 1, 2, 3... in the order members joined. Decides who gets the extra cents.
  position INTEGER NOT NULL,
  CONSTRAINT fk_members_home FOREIGN KEY (home_id) REFERENCES homes (id),
  CONSTRAINT uq_members_home_position UNIQUE (home_id, position),
  CONSTRAINT chk_members_name_not_blank CHECK (length(trim(name)) > 0)
);

CREATE TABLE bills (
  id          TEXT PRIMARY KEY,
  home_id     TEXT NOT NULL,
  title       TEXT NOT NULL,
  total_cents INTEGER NOT NULL,
  created_at  TEXT NOT NULL,
  CONSTRAINT fk_bills_home FOREIGN KEY (home_id) REFERENCES homes (id),
  CONSTRAINT chk_bills_total_positive CHECK (typeof(total_cents) = 'integer' AND total_cents > 0)
);

CREATE TABLE shares (
  id              TEXT PRIMARY KEY,
  bill_id         TEXT NOT NULL,
  member_id       TEXT NOT NULL,
  amount_cents    INTEGER NOT NULL,
  paid_at         TEXT,
  idempotency_key TEXT,
  CONSTRAINT fk_shares_bill FOREIGN KEY (bill_id) REFERENCES bills (id),
  CONSTRAINT fk_shares_member FOREIGN KEY (member_id) REFERENCES members (id),
  CONSTRAINT uq_shares_bill_member UNIQUE (bill_id, member_id),
  CONSTRAINT chk_shares_amount_not_negative CHECK (typeof(amount_cents) = 'integer' AND amount_cents >= 0),
  -- A share is either unpaid (both NULL) or paid with the key that paid it (both set).
  CONSTRAINT chk_shares_paid_has_key CHECK ((paid_at IS NULL) = (idempotency_key IS NULL))
);

CREATE INDEX idx_bills_home ON bills (home_id);
CREATE INDEX idx_shares_member ON shares (member_id);
