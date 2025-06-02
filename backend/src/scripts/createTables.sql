CREATE TABLE IF NOT EXISTS characters (
    id VARCHAR(10) PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    background_description TEXT,
    relationships TEXT,
    system_prompt TEXT NOT NULL,
    voice_id VARCHAR(50),
    voice_speed DECIMAL(3,2),
    voice_pitch DECIMAL(3,2),
    voice_volume DECIMAL(3,2),
    fallback_reply TEXT NOT NULL,
    character_image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS stories (
    id VARCHAR(5) PRIMARY KEY,
    book_id VARCHAR(10) NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    cover_image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
); 