export const debounce = (func, timeout = 500)=> {
    let timer;
    return (...args)=> {
        clearTimeout(timer)
        timer = setTimeout(()=> {
            console.log('ARGS', args, func)
            func(args[0])
        }, timeout)
    }
}