class Module {
    constructor(client) {
        this.presence = [];

        this.interval = client.setInterval(() => {
            client.user.setPresence(pickRandomActivity());
        }, 10000);
    }

    addGame(name, type, url) {
        this.presence.push({
            game: {
                name: name,
                type: type,
                url: url
            }
        })
    }

    addGame(name, type) {
        this.addGame(name, type, '');
    }

    removeGame(index) {
        this.presence = this.presence.filter(item => {
            return item != this.presence[index]
        })
    }

    removeGame(name, type) {
        this.removeGame(this.presence.indexOf({
            game: {
                name: name,
                type: type
            }
        }))
    }
}

function pickRandomActivity(activities) {
    return activities[Math.floor(Math.random() * Math.floor(this.presence.length - 1))];
}