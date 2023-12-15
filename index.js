
fetch("http://localhost:3031/v1/school", {
    method: "PATCH",
    mode: "cors",
    headers: {
        'Content-Type': 'application/json' // JSON形式のデータのヘッダー
    },
    body: JSON.stringify({
        token: `Bearer K6WAzUJX6wJF8IwkOyYE3x12Xml6826qhNZkV4rtd1c`,
        schoolId: 0,
        bodies: [
            {
                headKey: "userDatas",
                grade: 1,
                class: 4,
                date: "mon",
                key: "timelineData",
                value: [{
                    "name": "論理・表現 I",
                    "place": "どっか！",
                    "homework": [
                        {
                            "name": "ワーク",
                            "istooBig": true,
                            "page": {
                                "start": 1,
                                "end": 2,
                                "comment": "めちゃくちゃ難しいです"
                            }
                        }
                    ],
                },
                {
                    "name": "生物基礎",
                    "place": "教室",
                    "homework": []
                },
                {
                    "name": "物理基礎",
                    "place": "移動ありまたは教室",
                    "homework": []
                },
                {
                    "name": "物理基礎",
                    "place": "移動ありまたは教室",
                    "homework": []
                },
                {
                    "name": "美術 I ・ 音楽 I",
                    "place": "人により異なる",
                    "homework": []
                },
                {
                    "name": "美術 I ・ 音楽 I",
                    "place": "人により異なる",
                    "homework": []
                },
                {
                    "name": "公共",
                    "place": "教室",
                    "homework": []
                }
                ]
            },
            {
                headKey: "userDatas",
                grade: 1,
                class: 5,
                date: "mon",
                key: "timelineData",
                index : 0,
                value : {
                    name : "論理・表現 I",
                    place : "教室または105講義",
                    homework : []
                }
            }
        ]
    })
}).then((res) => res.json())
    .then((data) => {
        console.log(JSON.stringify(data))
    })