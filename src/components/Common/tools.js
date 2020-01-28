export function findObjectIndex(array, attr, value) {
    for(var i = 0; i < array.length; i += 1) {
        if(array[i][attr] === value) {
            return i;
        }
    }
    return -1;
}

export function uniqueArray(arrArg) {
    return arrArg.filter(function(elem, pos,arr) {
        return arr.indexOf(elem) == pos;
    });
};

export function compareName(a,b) {
    if (a.name < b.name)
      return -1;
    if (a.name > b.name)
      return 1;
    return 0;
}

export function compareGroup(a,b) {
    if(a.groupData && b.groupData){
        if(a.groupData.name < b.groupData.name){
            return -1;
        } else {
            return 1;
        }
    } else if(a.groupData && !b.groupData){
        return 1;
    } else if(!a.groupData && b.groupData){
        return -1;
    }
    return 0;
}

export function throttle(callback, wait, immediate = false) {
    let timeout = null 
    let initialCall = true
    
    return function() {
      const callNow = immediate && initialCall
      const next = () => {
        callback.apply(this, arguments)
        timeout = null
      }
      
      if (callNow) {
        initialCall = false
        next()
      }
  
      if (!timeout) {
        timeout = setTimeout(next, wait)
      }
    }
}

export function debounce(callback, wait, immediate = false) {
    let timeout = null 
    
    return function() {
      const callNow = immediate && !timeout
      const next = () => callback.apply(this, arguments)
      
      clearTimeout(timeout)
      timeout = setTimeout(next, wait)
  
      if (callNow) {
        next()
      }
    }
  }