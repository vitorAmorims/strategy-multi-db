DROP TABLE IF EXISTS TB_HEROIS;
CREATE TABLE TB_HEROIS (
    ID INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY NOT NULL,
    NOME TEXT NOT NULL,
    PODER TEXT NOT NULL
);

INSERT INTO tb_herois(nome, poder)
VALUES
    ('Batman', 'dinheiro'),
    ('flash', 'velocidade'),
    ('Goku', 'Deus'),
    ('Capitao planeta', 'elementos');

select * from tb_herois;

select * from tb_herois where id = 1;

update tb_herois set nome='Deus', poder='mais que Divino' where id = 3;

delete from tb_herois where id = 4;