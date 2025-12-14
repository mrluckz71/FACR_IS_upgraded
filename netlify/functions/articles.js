const {
  getArticles,
  getArticle,
  addArticle,
  editArticle,
  deleteArticle,
  deleteAllArticles,
  getUserArticles
} = require('./articleDb');

exports.handler = async (event, context) => {
  try {
    const method = event.httpMethod;
    const path = event.path;
    const queryParams = event.queryStringParameters || {};

    // GET /api/articles - Get all articles
    if (method === 'GET' && !queryParams.id && !queryParams.userId) {
      const articles = getArticles();
        const articles = await getArticles();
      return {
        statusCode: 200,
        body: JSON.stringify({ success: true, articles })
      };
    }

    // GET /api/articles?id=xxx - Get single article
    if (method === 'GET' && queryParams.id) {
      const article = getArticle(queryParams.id);
        const article = await getArticle(queryParams.id);
      if (!article) {
        return {
          statusCode: 404,
          body: JSON.stringify({ error: 'Article not found' })
        };
      }
      return {
        statusCode: 200,
        body: JSON.stringify({ success: true, article })
      };
    }

    // GET /api/articles?userId=xxx - Get user's articles
    if (method === 'GET' && queryParams.userId) {
      const articles = getUserArticles(queryParams.userId);
        const articles = await getUserArticles(queryParams.userId);
      return {
        statusCode: 200,
        body: JSON.stringify({ success: true, articles })
      };
    }

    // POST /api/articles - Add new article
    if (method === 'POST') {
      const { userId, title, email, content, date } = JSON.parse(event.body);
      
      if (!userId || !title || !email || !content) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'Missing required fields' })
        };
      }

      const newArticle = addArticle(userId, title, email, content, date || new Date().toISOString());
        const newArticle = await addArticle(userId, title, email, content, date || new Date().toISOString());
      return {
        statusCode: 201,
        body: JSON.stringify({ success: true, article: newArticle })
      };
    }

    // PUT /api/articles - Edit article
    if (method === 'PUT') {
      const { id, title, content } = JSON.parse(event.body);
      
      if (!id || !title || !content) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'Missing required fields' })
        };
      }

      const success = editArticle(id, title, content);
        const success = await editArticle(id, title, content);
      if (!success) {
        return {
          statusCode: 404,
          body: JSON.stringify({ error: 'Article not found' })
        };
      }

      return {
        statusCode: 200,
        body: JSON.stringify({ success: true, message: 'Article updated' })
      };
    }

    // DELETE /api/articles?id=xxx - Delete article
    if (method === 'DELETE' && queryParams.id) {
      const success = deleteArticle(queryParams.id);
        const success = await deleteArticle(queryParams.id);
      if (!success) {
        return {
          statusCode: 404,
          body: JSON.stringify({ error: 'Article not found' })
        };
      }
      return {
        statusCode: 200,
        body: JSON.stringify({ success: true, message: 'Article deleted' })
      };
    }

    // DELETE /api/articles?all=true - Delete all articles
    if (method === 'DELETE' && queryParams.all === 'true') {
      deleteAllArticles();
        await deleteAllArticles();
      return {
        statusCode: 200,
        body: JSON.stringify({ success: true, message: 'All articles deleted' })
      };
    }

    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  } catch (error) {
    console.error('Articles error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Server error' })
    };
  }
};
