import axios from "axios";
import { env } from "../configs/env";
import { HttpException } from "../error/AppError";
import postRepository from "../repositories/post.repository";
import { SearchRequestDto } from "../dtos/search";
import { mapPostToResponse } from "../dtos/post/mapper";
import { performance } from "perf_hooks";

type SearchResponse = {
  data: [string, number][]; // [personId, score]
};

class SearchService {
  searchPersons = async (data: SearchRequestDto) => {
    const startTotalService = performance.now();
    try {
      const startAISearch = performance.now();
      const result = await axios.post<SearchResponse>(`${env.AI_URL}/search/`, {
        image_base64: data.image_base64,
      });
      const endAISearch = performance.now();
      console.log(`[Timer] [Service] [Search] AI Search API call took: ${(endAISearch - startAISearch).toFixed(2)}ms`);

      const searchData = result.data.data;
      
      // Filter out scores >= 0.8
      const filteredSearchData = searchData.filter(([_id, score]) => score < 1);
      
      const personIds = filteredSearchData.map(([id]) => id);

      if (personIds.length === 0) {
        const endTotalService = performance.now();
        console.log(`[Timer] [Service] [Search] Total searchService took: ${(endTotalService - startTotalService).toFixed(2)}ms (no match ids)`);
        return [];
      }

      // Query posts by person IDs
      const startDBQuery = performance.now();
      const posts = await postRepository.findByPersonIds(personIds);
      const endDBQuery = performance.now();
      console.log(`[Timer] [Service] [Search] DB fetch posts by Person IDs took: ${(endDBQuery - startDBQuery).toFixed(2)}ms`);

      const personPostMap = new Map<string, typeof posts>();

      posts.forEach((post) => {
          const personId = post.personId;
          if (!personId) {
            return;
          }

          if (!personPostMap.has(personId)) {
            personPostMap.set(personId, []);
          }
          personPostMap.get(personId)?.push(post);
      });

      // Map the results and include the score
      const startMapping = performance.now();
      const searchResults = filteredSearchData
        .flatMap(([id, score]) => {
          const personPosts = personPostMap.get(id);
          if (!personPosts) return null;
          
          return personPosts.map((post) => ({
            ...mapPostToResponse(post),
            similarity_score: score,

          }));
          
        })
        .filter((item) => item !== null);

      return searchResults;
    } catch (error: any) {
      console.error("Lỗi khi tìm kiếm qua AI:", error);
      if (error.response) {
        const status = error.response.status;
        let errorMessage = "Lỗi Server AI";
        const detail = error.response.data?.detail;
        if (typeof detail === "string") {
          errorMessage = detail;
        } else if (Array.isArray(detail) && detail.length > 0) {
          errorMessage = detail[0].msg || detail[0].loc;
        }
        throw new HttpException(
          `Lỗi khi tìm kiếm đặc điểm nhận dạng: ${errorMessage}`,
          status,
        );
      }
      throw new HttpException(
        `Lỗi khi tìm kiếm đặc điểm nhận dạng: Lỗi Server`,
        500,
      );
    }
  };
}

export default new SearchService();
