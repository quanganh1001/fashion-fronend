import { apiPrivate } from '../Ultils/AxiosCustomize';

export const getAllColors =  () => {
    return apiPrivate.get('colors');
   
};

export const createColor = (colorDto) => {
    console.log(colorDto);
    
    return apiPrivate.post('colors', {colorCode: colorDto.newColorCode,name:colorDto.newColorName});
};

export const deleteColor = (id) => {
    return apiPrivate.delete('colors/' + id);
};

