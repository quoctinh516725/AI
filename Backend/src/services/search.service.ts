import axios from "axios";
import { env } from "../configs/env";
import { HttpException } from "../error/AppError";
import postRepository from "../repositories/post.repository";
import { SearchRequestDto } from "../dtos/search";
import { mapPostToResponse } from "../dtos/post/mapper";

type SearchResponse = {
  data: [string, number][]; // [personId, score]
};

class SearchService {
  searchPersons = async (data: SearchRequestDto) => {
    try {
      const result = await axios.post<SearchResponse>(`${env.AI_URL}/search/`, {
        image_base64: data.image_base64,
      });

      const searchData = result.data.data;
      console.log("Search: ",searchData);
      

      // Filter out scores >= 0.8
      const filteredSearchData = searchData.filter(([_id, score]) => score < 1);
      const personIds = filteredSearchData.map(([id]) => id);

      if (personIds.length === 0) {
        return [];
      }

      // Query posts by person IDs
      const posts = await postRepository.findByPersonIds(personIds);
      const personPostMap = new Map(posts.map((post) => [post.personId, post]));

      // Map the results and include the score
      const searchResults = filteredSearchData
        .map(([id, score]) => {
          const post = personPostMap.get(id);
          if (!post) return null;
          
          return {
            ...mapPostToResponse(post),
            similarity_score: score,
          };
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
