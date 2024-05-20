import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'my-app';
        inputText: string = '';
        parsedAddress: { name?: string, phone?: string, subDistrict?: string, district?: string, province?: string, zipCode?: string } | null = null;

        onInputChange(event: Event): void {
          const inputElement = event.target as HTMLInputElement;
          const inputValue = inputElement.value;
          console.log(inputValue);
          this.inputText = inputValue;
          this.parsedAddress = this.parseAddress(inputValue);
        }

        parseAddress(address: string) {
          // แยกข้อมูลที่คั่นด้วยช่องว่าง
          const parts = address.split(/[\s,]+/);

          // const parts = address.split(/\s+/);
          let name = '';
          let phone = '';
          let subDistrict = '';
          let district = '';
          let province = '';
          let provinces = '';
          let zipCode = '';
          let isProvinceNext = false;
          let issubDistrictNext = false;
          let isDistrictNext = false;

          // ตรวจสอบแต่ละส่วนและจัดหมวดหมู่
          parts.forEach(part => {
            const [prefix, value] = part.trim().split(' ', 2);

            if (/^\d{10}$/.test(part)) {
              phone = part;
            }
            else if (/^\d{5}$/.test(part)) {
              zipCode = part;
            }
  
            if (isProvinceNext) {
              province = part;
              subDistrict = part;
              district = part;
              isProvinceNext = false;
              issubDistrictNext = false;
              isDistrictNext = false;
            } 
            else if (part.startsWith('จ.')) {
              province = part.substring(2);
            }
            else if (part === 'จังหวัด') {
              isProvinceNext = true;
            }

            else if (part.startsWith('อ.')) {
              district = part.substring(2);
            }
            else if (part === 'อำเภอ') {
              isDistrictNext = true;
            }
            else if (part.startsWith('ต.')) {
              subDistrict = part.substring(2);
            }
            else if (part === 'ตำบล') {
              issubDistrictNext = true;
            }
            else {
              name += part + ' ';
            }
          });

          if (!province) {
            province = provinces;
          }
          console.log(provinces);

          return {
            name: name.trim(),
            phone: phone.trim(),
            subDistrict: subDistrict.trim(),
            district: district.trim(),
            province: province.trim(),
            provinces: provinces.trim(),
            zipCode: zipCode.trim(),
          };
        }

}




