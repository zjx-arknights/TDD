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