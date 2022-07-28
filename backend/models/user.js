class User {
    constructor(id = null, name = null, email = null, password = null) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
    }
}

module.exports = User;