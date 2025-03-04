# MyTest


# 機能要件
- `public/data.json`のデータを表示するテーブルを作成する。
- 条件による絞り込み機能
    - salon_nameが一致するデータのみ表示できるようにする。
    - salon_nameはsalon_name列に存在するもの全てを選択肢として、プルダウンで選択する。
- 以下のカラムには単位で`%`をつける。
    - skr
    - hj
    - f
    - nn
    - ns
    - 上記のカラムは全て数字の昇順、降順で並べら変えられるようにする。
- `reviews`の数で絞り込めるようにする。
    - 任意の数値に対して、`>`, `<`, `=`, `>=`, `<=`でデータをフィルタリングできるようにする。



# public/data.jsonの構造
```json
{
    "users": [
        {
            "id": 61729,
            "salon_id": 5070,
            "name": "三好 なぎさ (23)",
            "img": "https://men-esthe.jp/contents/therapist/d8b1719feb5237813edb4b159ad26baa.jpg",
            "style": "T164/B90(G) ",
            "salon_name": "Momo Spa",
            "score": 75.0,
            "reviews": 2,
            "skr": 100.0,
            "hj": 100.0,
            "f": 100.0,
            "nn": 100.0,
            "ns": 100.0
        }
    ]
}
```