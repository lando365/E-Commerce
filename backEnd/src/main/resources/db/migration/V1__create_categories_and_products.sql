-- Catégories
CREATE TABLE categories
(
    id   BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(120) NOT NULL UNIQUE
);

-- Produits
CREATE TABLE products
(
    id          BIGINT PRIMARY KEY AUTO_INCREMENT,
    name        VARCHAR(140)   NOT NULL,
    brand_name  VARCHAR(120)   NOT NULL,
    price       DECIMAL(14, 2) NOT NULL,
    image_url   VARCHAR(1000)  NOT NULL,
    category_id BIGINT,
    CONSTRAINT fk_product_category
        FOREIGN KEY (category_id) REFERENCES categories (id)
            ON UPDATE CASCADE ON DELETE SET NULL
);

CREATE INDEX idx_products_category ON products (category_id);
CREATE INDEX idx_products_brand ON products (brand_name);
