

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
    let district = '';
    let province = '';
    let zipCode = '';
    let rawAddress = address;
    const nameMatch = address.match(/^\d+\s+(.+?)\s*\(/);                                     //ค้นหาตัวเลขที่อยู่ด้านหน้า และจากนั้นค้นหาข้อความที่อยู่ระหว่างวงเล็บ เช่น  31 P'Boss (
    const phoneMatch = address.match(/(?:โทร|เบอร์โทร|โทร.)?\s*(\d{3}[-]?\d{3}[-]?\d{4})/);    //ค้นหาหมายเลขโทรศัพท์
    const postalCodeMatch = address.match(/\b\d{5}\b/);                                      //ค้นหารหัสไปรษณีย์
    const provinceMatch = address.match(/(?:จ\.|จังหวัด)\s*(\S+)/);                           //ค้นหาจังหวัด
    const districtMatch = address.match(/(?:อ\.|อำเภอ)\s*(\S+)/);                          //ค้นหาอำเภอ
    const subDistrictMatch = address.match(/(?:ต\.|ตำบล)\s*(\S+)/);                       //ค้นหาตำบล
    const districtsMatch = address.match(/(?:เขต\.|เขต)\s*(\S+)/);                        //ค้นหาเขต
    const subDistrictsMatch = address.match(/(?:แขวง\.|แขวง)\s*(\S+)/);                  //ค้นหาแขวง
    const phoneDirectMatch = address.match(/\b\d{10}\b/);                               //ค้นหาหมายเลขโทรศัพท์โดยตรง

    if (nameMatch) {
      name = nameMatch[1].trim(); //ลบช่องว่างด้านหน้าและด้านหลังข้อความ
      rawAddress = rawAddress.replace(nameMatch[0], '');
    }
    if (phoneMatch) {
      phone = phoneMatch[1].replace(/-/g, '').trim();  //ลบเครื่องหมายขีดกลาง (-) ทั้งหมดออก
      rawAddress = rawAddress.replace(phoneMatch[0], '');
    }
    if (!phone && phoneDirectMatch) {
      phone = phoneDirectMatch[0].replace(/-/g, '').trim();   //ลบเครื่องหมายขีดกลาง (-) ทั้งหมดออก
      rawAddress = rawAddress.replace(phoneDirectMatch[0], '');
    }
    if (postalCodeMatch) {
      zipCode = postalCodeMatch[0].trim();    //ลบช่องว่างด้านหน้าและด้านหลังข้อความ
      rawAddress = rawAddress.replace(postalCodeMatch[0], '');
    }
    if (provinceMatch) {
      province = provinceMatch[1].trim();    //ลบช่องว่างด้านหน้าและด้านหลังข้อความ
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
      district = districtsMatch[1].trim();  
      rawAddress = rawAddress.replace(districtsMatch[0], '');
    }
    if (subDistrictsMatch) {
      subDistrict = subDistrictsMatch[1].trim();
      rawAddress = rawAddress.replace(subDistrictsMatch[0], '');
    }

    const cleanedAddress = rawAddress
      .replace(/^\d+\s*/, '')               // ลบตัวเลขที่อยู่ด้านหน้า ID
      .replace(/ระหัส\s?ไปรษณี/, '')        // Remove "ระหัส ไปรษณี"
      .replace(/เลขไปรษณีย์\s?/, '')       // Remove "เลขไปรษณีย์"
      .replace(/\([^)]*\)/g, '')         // ลบข้อมูลที่อยู่ภายในวงเล็บทั้งหมด
      .replace(/\s*\([^)]*\)/, '')      // ลบข้อมูลที่อยู่ภายในวงเล็บทั้งหมดและช่องว่างด้านหน้า
      .replace(/[^\s]+\)\s*/g, '')     //ลบข้อความที่มีตัวอักษรตามด้วย ")" พร้อมกับช่องว่าง (ถ้ามี) ทั้งหมด
      .trim();

    return {
      name,
      address: cleanedAddress,
      phone,
      subDistrict,
      district,
      province,
      zipCode,
    };
  }
}
