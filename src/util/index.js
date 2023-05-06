export const convertToBase64 = (file) => new Promise((resolve, reject) => {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
        var img = new Image();
        img.sizes = e.target.size
        Number.prototype.formatBytes = function () {
            var units = ['B', 'KB', 'MB', 'GB', 'TB'],
                bytes = this,
                i;
            for (i = 0; bytes >= 1024 && i < 4; i++) {
                bytes /= 1024;
            }
            return bytes.toFixed(2) + units[i];
        }
        let a = reader.result.length;
        console.log(reader.result);
        resolve(reader.result)
    };
    reader.onerror = (error) => {
        console.log('Error: ', error);
        reject(error)
    };

})
export const nameAndNumberOnlyCharactersRegex = new RegExp(`^[a-zA-Z0-9 -]+$`);
export const onlyNumbersRegex = new RegExp(`^[0-9]+$`);
export const nameOnlyCharactersRegex = new RegExp(`^[a-zA-Z -]+$`);
export const validateEmail = (email) => {
    const validEmailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return validEmailRegex.test(email);
}
export const formatSizeUnits = (bytes) => {
    if (bytes >= 1073741824) { bytes = (bytes / 1073741824).toFixed(2) + " GB"; }
    else if (bytes >= 1048576) { bytes = (bytes / 1048576).toFixed(2) + " MB"; }
    else if (bytes >= 1024) { bytes = (bytes / 1024).toFixed(2) + " KB"; }
    else if (bytes > 1) { bytes = bytes + " bytes"; }
    else if (bytes == 1) { bytes = bytes + " byte"; }
    else { bytes = "0 bytes"; }
    return bytes;
}
export const formatSizeUnitsCondition = (bytes) => {
    if (bytes >= 1073741824) { return true }
    else if (bytes >= 1048576) { return true }
    else if (bytes >= 1024) {
        let b = (bytes / 1024).toFixed(2);
        if (parseInt(b) > 40) {
            return true
        } else {
            return false
        }
    }
    else if (bytes > 1) { return false }
    else if (bytes == 1) { return true }
    else { bytes = "0 bytes"; }
    return bytes;
}