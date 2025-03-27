async function getFetch(url = 'http://localhost:2800/results') {
    try {
        let response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            }
        })
        if (!response.ok) {
            throw new Error(`Помилка запиту: ${response.statusText}`);
        }
        let result = await response.json();
        return result   
    } catch (error) {
        console.error('Помилка запиту', error)
    }
}

module.exports = {
    getFetch
}