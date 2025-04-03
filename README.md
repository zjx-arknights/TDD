<div style="text-align:center"><strong>测试驱动开发(TDD)</strong></div>
<br>
<p>使用测试驱动开发(TDD)方法来创建一个判断字符串是否为IPv4地址的功能，采用面向对象风格，并使用类似xUnit的测试框架（这里使用Jest，它是JavaScript中类似xUnit的流行测试框架）</p>
<br>
<p><strong>步骤 1: 创建测试文件</strong></p>

<p>首先，我们创建一个测试文件 IpAddressValidator.test.js
</p>

```javascript
const IpAddressValidator = require('./IpAddressValidator');

describe('IpAddressValidator', () => {
    let validator;

    beforeEach(() => {
        validator = new IpAddressValidator();
    });

    //测试空字符串能否通过检测
    test('should return false for empty string', () => {
        expect(validator.isValidIp4Address('')).toBe(false);
    });
    //测试不是string格式数据能否通过检测
    test('should return false for non-string input', () => {
        expect(validator.isValidIp4Address(123)).toBe(false);
        expect(validator.isValidIp4Address(null)).toBe(false);
        expect(validator.isValidIp4Address(undefined)).toBe(false);
        expect(validator.isValidIp4Address({})).toBe(false);
    });
    //测试不正确的IP格式能否通过检测
    test('should return false for invalid IP format', () => {
        expect(validator.isValidIp4Address('192.168.1')).toBe(false);
        expect(validator.isValidIp4Address('192.168.1.1.1')).toBe(false);
        expect(validator.isValidIp4Address('192.168.1.')).toBe(false);
        expect(validator.isValidIp4Address('.192.168.1.1')).toBe(false);
    });
    //测试不是纯数字的IP格式能否通过检测
    test('should return false for IP with non-numeric parts', () => {
        expect(validator.isValidIp4Address('192.168.a.1')).toBe(false);
        expect(validator.isValidIp4Address('192.168.1.1a')).toBe(false);
    });
    //测试超过范围的IP格式能否通过检测
    test('should return false for IP parts out of range', () => {
        expect(validator.isValidIp4Address('256.168.1.1')).toBe(false);
        expect(validator.isValidIp4Address('192.168.1.256')).toBe(false);
        expect(validator.isValidIp4Address('192.168.-1.1')).toBe(false);
    });
    //测试正确的IP格式能否通过检测
    test('should return true for valid IP addresses', () => {
        expect(validator.isValidIp4Address('192.168.1.1')).toBe(true);
        expect(validator.isValidIp4Address('0.0.0.0')).toBe(true);
        expect(validator.isValidIp4Address('255.255.255.255')).toBe(true);
        expect(validator.isValidIp4Address('10.0.0.1')).toBe(true);
    });
    //测试有前置0的非标准形式的IP格式能否通过检测
    test('should return false for IP with leading zeros unless zero itself', () => {
        expect(validator.isValidIp4Address('192.168.01.1')).toBe(false);
        expect(validator.isValidIp4Address('192.168.1.001')).toBe(false);
        expect(validator.isValidIp4Address('192.168.0.1')).toBe(true);
    });
});
```

<p><strong>步骤 2: 创建初始实现</strong></p>
<p>现在创建 IpAddressValidator.js 文件，最初只让第一个测试通过</p>

```javascript
class IpAddressValidator {
  isValidIp4Address(input) {
    if (typeof input !== 'string') {
      return false;
    }
    
    if (input.length === 0) {
      return false;
    }
    
    return false; // 其他情况暂时返回false
  }
}

module.exports = IpAddressValidator;
```

<p><strong>步骤 3: 逐步实现功能</strong></p>
<p>随着测试的进行，我们逐步完善实现</p>

```javascript
class IpAddressValidator {
  isValidIp4Address(input) {
    if (typeof input !== 'string' || input.length === 0) {
      return false;
    }
    
    const parts = input.split('.');
    if (parts.length !== 4) {
      return false;
    }
    
    for (const part of parts) {
      if (part.length === 0 || part.length > 3) {
        return false;
      }
      
      // 检查是否为纯数字
      if (!/^\d+$/.test(part)) {
        return false;
      }
      
      // 检查前导零
      if (part.length > 1 && part[0] === '0') {
        return false;
      }
      
      const num = parseInt(part, 10);
      if (num < 0 || num > 255) {
        return false;
      }
    }
    
    return true;
  }
}

module.exports = IpAddressValidator;
```

<p><strong>步骤 4: 重构和优化</strong></p>
<p>我们可以将一些逻辑提取为私有方法，使代码更清晰</p>

```javascript
class IpAddressValidator {
    //主要的公共方法，负责判断一个输入是否为有效的 IPv4 地址
    isValidIp4Address(input) {
        if (!this._isValidInput(input)) {
            return false;
        }

        const parts = input.split('.');
        if (!this._hasFourParts(parts)) {
            return false;
        }

        return this._areAllPartsValid(parts);
    }
    //辅助函数，用来检查输入是否是有效的字符串。
    _isValidInput(input) {
        return typeof input === 'string' && input.length > 0;
    }
    //判断输入的 IP 地址（分割成的部分）是否正好有四个部分
    _hasFourParts(parts) {
        return parts.length === 4;
    }
    //检查 IP 地址的每一部分是否都符合要求
    _areAllPartsValid(parts) {
        return parts.every(part => this._isValidPart(part));
    }
    //判断 IP 地址的某一部分是否符合有效的格式
    _isValidPart(part) {
        return this._hasValidLength(part) &&
            this._isNumeric(part) &&
            this._hasNoLeadingZeros(part) &&
            this._isInValidRange(part);
    }
    //判断 IP 地址的某一部分的长度是否合法
    _hasValidLength(part) {
        return part.length > 0 && part.length <= 3;
    }
    //检查 IP 地址的某一部分是否完全由数字组成
    _isNumeric(part) {
        return /^\d+$/.test(part);
    }
    //检查 IP 地址的某一部分是否没有前导零
    _hasNoLeadingZeros(part) {
        return part.length === 1 || part[0] !== '0';
    }
    //检查 IP 地址的某一部分是否在合法范围内（0 到 255）
    _isInValidRange(part) {
        const num = parseInt(part, 10);
        return num >= 0 && num <= 255;
    }
}

module.exports = IpAddressValidator;
```

<p><strong>步骤 5: 运行测试</strong></p>
<p>使用Jest运行测试</p>

```bash
npm install --save-dev jest
```

<p>然后在package.json中添加</p>

```json
"scripts": {
  "test": "jest"
}
```

<p>运行测试</p>

```bash
npm test
```

<p>最后输出以下内容，表示测试通过</p>

```bash
 PASS  ./IpAddressValidator.test.js
  IpAddressValidator
    √ should return false for empty string (1 ms)
    √ should return false for non-string input
    √ should return false for invalid IP format (1 ms)                                      
    √ should return false for IP with non-numeric parts                                     
    √ should return false for IP parts out of range                                         
    √ should return true for valid IP addresses                                             
    √ should return false for IP with leading zeros unless zero itself                      
                                                                                            
Test Suites: 1 passed, 1 total                                                              
Tests:       7 passed, 7 total                                                              
Snapshots:   0 total
Time:        0.494 s, estimated 1 s
Ran all test suites matching /IpAddressValidator.test.js/i.
```

### 总结

#####  我们遵循了TDD的流程:
- 先写测试
- 运行测试（应该失败）
- 编写最小实现使测试通过
- 重构代码
- 重复这个过程直到所有功能实现

最终我们得到了一个面向对象的IPv4地址验证器，具有清晰的职责分离和良好的可测试性
