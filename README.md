# kanjo

[![NPM version][npm-image]][npm-url]
[![NPM downloads][npm-download-image]][npm-download-url]
[![Build Status][travis-image]][travis-url]
[![Coverage Status][coveralls-image]][coveralls-url]
[![Dependency Status][daviddm-image]][daviddm-url]
[![DevDependency Status][daviddm-dev-image]][daviddm-dev-url]
[![License][license-image]][license-url]

Summarize AWS Billing

## Installation

```
npm install kanjo
```


## Usage

```javascript
import Kanjo from 'kanjo';

const kanjo = new Kanjo({
  account: 'ACCOUNT_ID',
  bucket: 'BUCKET_NAME',
  region: 'us-east-1'
});

kanjo.fetch(2015, 9).then(report => {
  console.log(report);
});

// Output ->
// { bills:
//    { total:
//       { accountId: 'xxxxxxxxxx',
//         accountName: 'account foo',
//         isPayer: true,
//         totalCost: 1360.57,
//         products: [Object] },
//      'xxxxxxxxxx':
//       { accountId: 'xxxxxxxxxx',
//         accountName: 'account foo',
//         isPayer: false,
//         totalCost: 1148.807296,
//         products: [Object] },
//      'yyyyyyyyyy':
//       { accountId: 'yyyyyyyyyy',
//         accountName: 'account bar',
//         isPayer: false,
//         totalCost: 211.706951,
//         products: [Object] } } }
```


## Related

- [kanjo-cli](https://github.com/moqada/kanjo-cli) - CLI for this module


## Todo

- [ ] Add tests
- [ ] Support weekly summary
- [ ] Support daily summary
- [ ] Support monthly forecast


[npm-url]: https://www.npmjs.com/package/kanjo
[npm-image]: https://img.shields.io/npm/v/kanjo.svg?style=flat-square
[npm-download-url]: https://www.npmjs.com/package/kanjo
[npm-download-image]: https://img.shields.io/npm/dm/kanjo.svg?style=flat-square
[travis-url]: https://travis-ci.org/moqada/kanjo
[travis-image]: https://img.shields.io/travis/moqada/kanjo.svg?style=flat-square
[coveralls-url]: https://coveralls.io/github/moqada/kanjo
[coveralls-image]: https://img.shields.io/coveralls/moqada/kanjo.svg?style=flat-square
[daviddm-url]: https://david-dm.org/moqada/kanjo
[daviddm-image]: https://img.shields.io/david/moqada/kanjo.svg?style=flat-square
[daviddm-dev-url]: https://david-dm.org/moqada/kanjo#info=devDependencies
[daviddm-dev-image]: https://img.shields.io/david/dev/moqada/kanjo.svg?style=flat-square
[license-url]: http://opensource.org/licenses/MIT
[license-image]: https://img.shields.io/npm/l/kanjo.svg?style=flat-square
