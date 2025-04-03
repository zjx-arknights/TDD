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