const mongoose = require('mongoose');
const config = require('../../config');

const ObjectId = mongoose.Types.ObjectId;
const ISODate = (ISODateString) => new Date(ISODateString);

module.exports = {
  title: '[예나르] 테스트',
  plan: 'trial',
  description: '설명이닷',
  subjectType: 'game-test',
  tags: ['태그', '테스트', '예나르', '메롱'],
  purpose: 'ㅇㅇㅇㅇㅇㅇ',
  coverImageUrl: 'https://lh3.googleusercontent.com/IlZO8F8X0Wg6jYAtXrE3fHsKQLuQ6u72NeXVLKnuUG10s3YlTI3RgGjjETWXdrR8hXM=w1372-h946-rw',
  iconImageUrl: 'https://lh3.googleusercontent.com/K-MNjDiO2WwRNwJqPZu8Wd5eOmFEjLYkEEgjZlv35hTiua_VylRPb04Lig3YZXLERvI=s180',
  openDate: ISODate('2020-06-03T00:00:00.288Z'),
  closeDate: ISODate('2020-06-03T14:59:59.288Z'),
  rewards: {
    list: [
      {
        "type": "best",
        "title": "테스트 수석",
        "iconImageUrl": "https://i.imgur.com/ybuI732.png",
        "content": "문화상품권 3만원",
        "price": 30000,
        "count": 1,
        "order": 1
      }, {
        "type": "participated",
        "title": "테스트 수석",
        "iconImageUrl": "https://i.imgur.com/ybuI732.png",
        "content": "문화상품권 3만원",
        "price": 30000,
        "count": -1,
        "order": 2
      }
    ]
  },
  missions: [
    {
      order: 1,
      type: 'play',
      title: '게임 플레이',
      description: '[게임명] 게임을 플레이해주세요.(30분 이상 권장)',
      descriptionImageUrl: 'https://i.imgur.com/FDDy1WG.png',
      guide: '• 미션에 참여하면 테스트 대상 게임 보호를 위해 무단 배포 금지에 동의한 것으로 간주됩니다.',
      packageName: 'com.supercell.clashroyale',
      actionType: 'default',
      action: 'https://play.google.com/store/apps/details?id=com.supercell.clashroyale',
      options: ["recheckable", "repeatable"],
      deeplink: 'https://play.google.com/store/apps/details?id=com.supercell.clashroyale'
    },
    {
      order: 2,
      type: 'survey',
      title: '플레이 후 소감 작성',
      description: '[게임명]에 대한 구체적인 의견을 작성해주세요.',
      descriptionImageUrl: 'https://i.imgur.com/XfqTB0K.png',
      guide: '• "참여 완료" 상태에도 소감을 수정할 수 있습니다.\n• 솔직하고 구체적으로 의견을 적어주시는게 제일 중요합니다.',
      actionType: 'internal_web',
      action: 'https://www.naver.com',
      options: ["recheckable", "repeatable", "mandatory"],
      packageName: 'com.supercell.clashroyale'
    }
  ],
  status: 'test',
  bugReport: {url: 'https://www.naver.com'}
}