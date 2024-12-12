'use strict';

export function getDisplaySelect(app: any, device: any, buttons: any, ident: string, model: any = null, command: any = null, title: any = null) {
  device.functions.push({
    title: title ? title : `main.${ident}`,
    type: ident,
    view: 'select',
    model: `device.:ident.status.${model ? model : ident}`,
    value: null,
    buttons,
    data: {
      ident: ':ident',
      command: command ? command : ident,
      value: `:${ident}`
    }
  });
}


export function getRegexValue(regex: any, str: string, index: number): any {
  let result = null;
  let m;
  while ((m = regex.exec(str)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (m.index === regex.lastIndex) {
      regex.lastIndex++;
    }

    // The result can be accessed through the `m`-variable.
    m.forEach((match: any, groupIndex: number) => {
      if (groupIndex === index) {
        result = match;
      }
    });
  }
  return result;
}

export function checkTimeoutEx(item: any, ident: string, method: any, timeout = 1000, force = false) {
  if (force || !item[ident] || new Date().getTime() - item[ident] >= timeout) {
    clearTimeout(item[`${ident}_timeout`]);
    item[ident] = new Date().getTime();
    method();
  } else {
    clearTimeout(item[`${ident}_timeout`]);
    item[`${ident}_timeout`] = setTimeout(() => {
      item[ident] = new Date().getTime();
      method();
    }, timeout - (new Date().getTime() - item[ident]));
  }
}

export function parseJson(result: any, params: any, ident = '') {
  Object.keys(params).forEach(key => {
    const newKey = `${ident}${ident ? '/' : ''}${key}`;
    if (params[key] && typeof params[key] === 'object') {
      parseJson(result, params[key], newKey);
    } else {
      result[newKey] = params[key];
    }
  });
}

export function combineObjects(target: any, source: any, check = false, error = false) {
  if (source && Array.isArray(source)) {
    source.forEach(item => {
      if (typeof item === 'object') {
        const item1 = {};
        combineObjects(item1, item);
        target.push(item1);
      } else {
        target.push(item);
      }
    });
  } else if (source) {
    Object.keys(source).forEach(key => {
      if (error && ['body'].indexOf(key) === -1) {
        // console.log('combineObjects', key, source[key]);
      } else if (source[key] === null) {
        target[key] = null;
      } else if (typeof source[key] === 'object') {
        if (!target[key]) {
          if (Array.isArray(source[key])) {
            target[key] = [];
          } else {
            target[key] = {};
          }
        }
        combineObjects(target[key], source[key], false, key === 'error')
      } else {
        if (!check || target[key] === undefined) {
          target[key] = source[key];
        }
      }
    });
  }
}

export function stringToHex(str: string) {
  let result = '';
  for (let i = 0; i < str.length; i++) {
    result += ('0' + str.charCodeAt(i).toString(16)).slice(-2);
  }
  return result;
}

export function removeLast(data: string, chr = '\n') {
  let result = data;
  if (data && data[data.length - 1] === chr) {
    result = data.substring(0, data.length - 1);
  }
  return result
}

export function between (x: number, min: number, max: number) {
  return x >= min && x <= max;
}

export function formatTimeInterval(time: number) {
  time = Math.floor(time / 1000);
  const days = Math.floor(time / 24 / 60 / 60);
  time = time - days * 24 * 60 * 60;
  const hours = Math.floor(time / 60 / 60);
  time = time - hours * 60 * 60;
  const minutes = Math.floor(time / 60);
  // time = time - minutes * 60;

  return `${days ? `${days}d ` : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}`; //:${time < 10 ? '0' : ''}${time}
}

export function getDeviceIdent(ident: string) {
  return ident.split('.').join('_');
}