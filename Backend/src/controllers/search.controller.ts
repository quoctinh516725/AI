import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ValidationError } from "../error/AppError";
import { sendSuccess } from "../utils/response";
import searchService from "../services/search.service";
import { validateSearchRequest } from "../dtos/search";
import { performance } from "perf_hooks";

class SearchController {
  searchPersons = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const startController = performance.now();
      const file = req.file;      
      if (!file) {
        throw new ValidationError("Vui lòng tải lên một hình ảnh để tìm kiếm");
      }
      
      const startValidation = performance.now();
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
      const endValidation = performance.now();
      console.log(`[Timer] [Controller] [Search] Data validation & base64 took: ${(endValidation - startValidation).toFixed(2)}ms`);

      const startServiceCall = performance.now();
      const searchResults = await searchService.searchPersons(validatedData);
      const endServiceCall = performance.now();
      console.log(`[Timer] [Controller] [Search] searchService.searchPersons call took: ${(endServiceCall - startServiceCall).toFixed(2)}ms`);

      const endController = performance.now();
      console.log(`[Timer] [Controller] [Search] Total searchPersons action took: ${(endController - startController).toFixed(2)}ms`);

      const overallStartTime = (req as any)._searchRequestStartTime;
      if (overallStartTime) {
        console.log(`[Timer] [E2E] [Search] Total E2E Search Request took: ${(performance.now() - overallStartTime).toFixed(2)}ms`);
      }

      sendSuccess(res, searchResults, "Tìm kiếm thành công");
    },
  );
}

export default new SearchController();
