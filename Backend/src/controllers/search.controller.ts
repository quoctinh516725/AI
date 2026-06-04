import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ValidationError } from "../error/AppError";
import { sendSuccess } from "../utils/response";
import searchService from "../services/search.service";
import { validateSearchRequest } from "../dtos/search";

class SearchController {
  searchPersons = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const file = req.file;

      if (!file) {
        throw new ValidationError("Vui lòng tải lên một hình ảnh để tìm kiếm");
      }
      
      const fileBufferBase64 = file.buffer.toString("base64");

      const { name, age, gender, location, hometown, lost_year, date_of_birth } = req.body;

      const validatedData = validateSearchRequest({
        image_base64: fileBufferBase64,
        name,
        age,
        gender,
        location,
        hometown,
        lost_year,
        date_of_birth
      });

      const searchResults = await searchService.searchPersons(validatedData);

      sendSuccess(res, searchResults, "Tìm kiếm thành công");
    },
  );
}

export default new SearchController();
