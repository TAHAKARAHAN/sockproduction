-- Create productions table for production tracking
CREATE TABLE IF NOT EXISTS productions (
    id VARCHAR(10) PRIMARY KEY,  -- Changed to VARCHAR to support 'P001' format
    style_no VARCHAR(50) NOT NULL,
    urun_adi VARCHAR(255) NOT NULL,
    siparis_id VARCHAR(50) NOT NULL,
    musteri VARCHAR(255) NOT NULL,
    miktar INTEGER NOT NULL DEFAULT 0,
    baslangic_tarihi DATE NOT NULL,
    tahmini_tamamlanma DATE NOT NULL,
    durum VARCHAR(50) NOT NULL DEFAULT 'Burun Dikişi',
    tamamlanma INTEGER NOT NULL DEFAULT 0,
    notlar TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_productions_style_no ON productions(style_no);
CREATE INDEX IF NOT EXISTS idx_productions_siparis_id ON productions(siparis_id);
CREATE INDEX IF NOT EXISTS idx_productions_durum ON productions(durum);

-- Create trigger to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_productions_timestamp
BEFORE UPDATE ON productions
FOR EACH ROW
EXECUTE PROCEDURE update_timestamp();

-- Insert some sample data with string IDs
INSERT INTO productions (id, style_no, urun_adi, siparis_id, musteri, miktar, baslangic_tarihi, tahmini_tamamlanma, durum, tamamlanma, notlar)
VALUES
    ('P001', 'ST-123456', 'Klasik Çorap', 'SIP-001', 'ABC Tekstil', 5000, '2023-07-01', '2023-07-15', 'Burun Dikişi', 15, 'Acil üretim gerekiyor'),
    ('P002', 'ST-234567', 'Spor Çorap', 'SIP-002', 'XYZ Giyim', 3000, '2023-07-05', '2023-07-20', 'Yıkama', 55, 'Özel paketleme yapılacak'),
    ('P003', 'ST-345678', 'Termal Çorap', 'SIP-003', 'LMN Tekstil', 2000, '2023-07-10', '2023-07-25', 'Kurutma', 70, NULL),
    ('P004', 'ST-456789', 'Bambu Çorap', 'SIP-004', 'PQR Giyim', 4000, '2023-06-15', '2023-07-10', 'Paketleme', 90, 'Kalite kontrol sonrası sevkiyat yapılacak'),
    ('P005', 'ST-567890', 'Yün Çorap', 'SIP-005', 'STU Tekstil', 1500, '2023-06-01', '2023-06-30', 'Tamamlandı', 100, 'Teslim edildi');
