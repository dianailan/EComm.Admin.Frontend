import { TestBed } from "@angular/core/testing";
import { FormControl, FormsModule } from "@angular/forms";
import { validateUrl } from "./web-page-details.component";

describe('component: TestComponent', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [FormsModule],
            declarations: [validateUrl]
        });
    });
    it('should return null if input value is url with protocol', () => {
        expect(validateUrl(new FormControl('http://test.ge'))).toEqual(null);
    });

    it('should return null if input value has no protocol', () => {
        expect(validateUrl(new FormControl('test.ge'))).toEqual(null);
    });

    it('should return null if input value contains path', () => {
        expect(validateUrl(new FormControl('test.ge/test'))).toEqual(null);
    });

    it('should return error if input is empty', () => {
        expect(validateUrl(new FormControl(''))).not.toEqual(null);
    });
})
