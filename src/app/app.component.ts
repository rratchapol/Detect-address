

import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Import FormsModule

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'my-app';
  inputText: string = '';
  parsedAddress: { name?: string, address?: string, phone?: string, subDistrict?: string, district?: string, subDistricts?: string, districts?: string, province?: string, zipCode?: string } | null = null;

  onInputChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const inputValue = inputElement.value;
    console.log(inputValue);
    this.inputText = inputValue;
    this.parsedAddress = this.parseAddress(inputValue);
  }

  parseAddress(address: string) {
    let name = '';
    let phone = '';
    let subDistrict = '';
    let subDistricts = '';
    let district = '';
    let districts = '';
    let province = '';
    let zipCode = '';
    let rawAddress = address;
    const nameMatch = address.match(/^\d+\s+(.+?)\s*\(/);
    const phoneMatch = address.match(/(?:โทร|เบอร์โทร|โทร.)?\s*(\d{3}[-]?\d{3}[-]?\d{4})/);
    const postalCodeMatch = address.match(/\b\d{5}\b/);
    // const provinceMatch = address.match(/จ\.(\S+)/);
    const provinceMatch = address.match(/(?:จ\.|จังหวัด)\s*(\S+)/);
    // const districtMatch = address.match(/อ\.(\S+)/);
    const districtMatch = address.match(/(?:อ\.|อำเภอ)\s*(\S+)/);

    // const subDistrictMatch = address.match(/ต\.(\S+)/);
    const subDistrictMatch = address.match(/(?:ต\.|ตำบล)\s*(\S+)/);

    const districtsMatch = address.match(/เขต(\S+)/);
    const subDistrictsMatch = address.match(/แขวง(\S+)/);
    const phoneDirectMatch = address.match(/\b\d{10}\b/);

    if (nameMatch) {
      name = nameMatch[1].trim();
      rawAddress = rawAddress.replace(nameMatch[0], '');
    }
    if (phoneMatch) {
      phone = phoneMatch[1].replace(/-/g, '').trim();
      rawAddress = rawAddress.replace(phoneMatch[0], '');
    }
    if (!phone && phoneDirectMatch) {
      phone = phoneDirectMatch[0].replace(/-/g, '').trim();
      rawAddress = rawAddress.replace(phoneDirectMatch[0], '');
    }
    if (postalCodeMatch) {
      zipCode = postalCodeMatch[0].trim();
      rawAddress = rawAddress.replace(postalCodeMatch[0], '');
    }
    if (provinceMatch) {
      province = provinceMatch[1].trim();
      rawAddress = rawAddress.replace(provinceMatch[0], '');
    }
    if (districtMatch) {
      district = districtMatch[1].trim();
      rawAddress = rawAddress.replace(districtMatch[0], '');
    }
    if (subDistrictMatch) {
      subDistrict = subDistrictMatch[1].trim();
      rawAddress = rawAddress.replace(subDistrictMatch[0], '');
    }
    if (districtsMatch) {
      districts = districtsMatch[1].trim();
      rawAddress = rawAddress.replace(districtsMatch[0], '');
    }
    if (subDistrictsMatch) {
      subDistricts = subDistrictsMatch[1].trim();
      rawAddress = rawAddress.replace(subDistrictsMatch[0], '');
    }

    const cleanedAddress = rawAddress
      .replace(/^\d+\s*/, '') // Remove leading numbers (record number)
      .replace(/\s*\(.+?\)/, '') // Remove anything in parentheses
      .replace(/aอ\)\s*/, '') // Remove "aอ)"
      .replace(/ระหัส\s?ไปรษณี\s?/, '') // Remove "ระหัส ไปรษณี"
      .trim();

    return {
      name,
      address: cleanedAddress,
      phone,
      subDistrict,
      district,
      subDistricts,
      districts,
      province,
      zipCode,
    };
  }
}
