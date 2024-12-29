const express = require('express')
const router = express.Router()
const fs = require('fs')
const csv = require('csv-parser')


// 映射表
const sourceToCountryMap = {
  'European Archive': 'United States of America',
  'Museopen': 'Canada',
  'Charlie Albright': 'Fiji',
  'William McColl': 'United Kingdom',
  'Soni Ventorum Wind Quintet': 'United States of America',
  'Stefano Ligoratti': 'Italy',
  'Ben Redwine': 'United States of America',
  'Roxana Pavel Goldstein': 'Russia',
  'Carl Banner': 'United States of America',
  'Musicians from Marlboro': 'United States of America',
  'Oliver Colbentston': 'United States of America',
  'Kimiko Ishizaka': 'Japan',
  'Scott Goff': 'United States of America',
  'Paul Pitman': 'United States of America',
  'John Garner': 'United States of America',
  'Timothy Jones': 'United States of America',
  'Edward Auer': 'United States of America',
  'Glen W. Prillaman': 'United States of America',
  'Karine Gilanyan': 'Armenia',
  'Pascal String Quartet': 'France',
  'Skidmore Wind Ensemble': 'United States of America',
  'Konstantin Semilakovs': 'Russia',
  'Sayuri Yano': 'Japan',
  'Soni Ventorum': 'United States of America',
  'Michael Sikich': 'United States of America',
  'Hielko Ubels': 'Netherlands',
  'Neal O’Doan': 'United States of America',
  'Chris Borovas': 'United States of America',
  'John Michel': 'United States of America',
  'Shuwen Zhang': 'China',
  'Peter Bradley-Fulgoni': 'United States of America',
  'Irrera Brothers': 'United States of America'
};

router.get('/musicnet', (req, res) => {
  const sources = new Set(); // 使用 Set 来存储不重复的 source
    const countryCount = {}; // 用于存储每个国家的 source 数量

    fs.createReadStream('./data/musicnet_metadata.csv') // 替换为你的 CSV 文件路径
        .pipe(csv())
        .on('data', (data) => {
            // 只提取 source 字段并存储到 Set 中
            if (data.source) {
                sources.add(data.source);
            }
        })
        .on('end', () => {
            // 统计每个国家的 source 数量
            sources.forEach(source => {
                const country = sourceToCountryMap[source];
                if (country) {
                    countryCount[country] = (countryCount[country] || 0) + 1;
                }
            });

            // 将结果转换为数组以便于前端处理
            const countryArray = Object.keys(countryCount).map(country => ({
                country: country,
                count: countryCount[country]
            }));

            res.json(countryArray); // 返回每个国家的 source 数量
        })
        .on('error', (error) => {
            console.error('Error reading CSV file:', error);
            res.status(500).send('Error reading CSV file');
        });
})

// 作曲家分析接口
router.get('/composer-analysis', (req, res) => {
  const results = []

  fs.createReadStream('./data/musicnet_metadata.csv') // 替换为你的 CSV 文件路径
    .pipe(csv())
    .on('data', (data) => {
      if (data.composer) {
        results.push(data.composer)
      }
    })
    .on('end', () => {
      const composerCount = {}
      results.forEach((composer) => {
        composerCount[composer] = (composerCount[composer] || 0) + 1
      })

      // 将结果转换为数组以便于前端处理
      const composerArray = Object.keys(composerCount).map((composer) => ({
        name: composer,
        count: composerCount[composer]
      }))

      res.json({data: composerArray}) // 返回作曲家分析结果
    })
    .on('error', (error) => {
      console.error('Error reading CSV file:', error)
      res.status(500).send('Error reading CSV file')
    })
})

module.exports = router
