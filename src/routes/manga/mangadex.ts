import { FastifyRequest, FastifyReply, FastifyInstance, RegisterOptions } from 'fastify';
import { MANGA } from '@consumet/extensions';

const routes = async (fastify: FastifyInstance, options: RegisterOptions) => {
  const mangadex = new MANGA.MangaDex();

  // Valid MangaDex content ratings
  const VALID_CONTENT_RATINGS = ['safe', 'suggestive', 'erotica', 'pornographic'];

  fastify.get('/', (_, rp) => {
    rp.status(200).send({
      intro:
        "Welcome to the mangadex provider: check out the provider's website @ https://mangadex.org/",
      routes: ['/:query', '/info/:id', '/read/:chapterId'],
      queryParams: {
        '/:query': 'page, limit, contentRating (comma-separated or multiple values)'
      },
      documentation: 'https://docs.consumet.org/#tag/mangadex',
    });
  });

  fastify.get('/:query', async (request: FastifyRequest, reply: FastifyReply) => {
    const query = (request.params as { query: string }).query;

    const { page, limit, contentRating } = request.query as {
      page?: number;
      limit?: number;
      contentRating?: string | string[];
    };

    // Parse contentRating - handle both single string and comma-separated values
    let contentRatingArray: string[] | undefined;
    if (contentRating) {
      if (Array.isArray(contentRating)) {
        contentRatingArray = contentRating;
      } else {
        contentRatingArray = contentRating.split(',').map(rating => rating.trim());
      }
    }

    try {
      const res = await mangadex.search(query, page, limit, contentRatingArray);
      reply.status(200).send(res);
    } catch (err) {
      reply.status(500).send({
        message: (err as Error).message || 'Something went wrong. Please try again later.'
      });
    }
  });

  fastify.get('/info', async (request: FastifyRequest, reply: FastifyReply) => {
    const id = decodeURIComponent((request.query as { id: string }).id);

    try {
      const res = await mangadex
        .fetchMangaInfo(id)
        .catch((err) => reply.status(404).send({ message: err }));

      reply.status(200).send(res);
    } catch (err) {
      reply
        .status(500)
        .send({ message: 'Something went wrong. Please try again later.' });
    }
  });

  fastify.get(
    '/read',
    async (request: FastifyRequest, reply: FastifyReply) => {
      const chapterId = (request.query as { chapterId: string }).chapterId;

      try {
        const res = await mangadex.fetchChapterPages(chapterId);

        reply.status(200).send(res);
      } catch (err) {
        reply
          .status(500)
          .send({ message: 'Something went wrong. Please try again later.' });
      }
    },
  );
};

export default routes;
