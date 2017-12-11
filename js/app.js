const vm = new Vue({
    el: '#counter',
    data: {
        value: null
    },
    methods: {
        spinner: function () {
            this.value = '<div class="ld ld-spin-fast spinner"></div>';
        },
        loadData: function () {
            this.spinner();
            fetch('https://hm.babichev.net/api/v1.1/currencies?q=USDT_BTC', {
                method: 'GET',
                credentials: 'include',
                cache: 'no-cache',
                mode: 'cors'
            }).then(res => res.json()).then((json) => {
                const row = json.data.query.results[0].row;
                this.value = parseInt(row.col1) + '$';
            })
        }
    },
    mounted: function () {
        this.loadData();
        setInterval(this.loadData, 5000);
    }
});
