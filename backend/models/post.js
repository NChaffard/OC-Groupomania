class Post {
    constructor(id = null, userId = null, text = null, imageUrl = null, likes = null, dislikes = null) {
        this.id = id;
        this.userId = userId;
        this.text = text;
        this.imageUrl = imageUrl;
        this.likes = likes;
        this.dislikes = dislikes;

    }
}

module.exports = Post;