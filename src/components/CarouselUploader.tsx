import React, { useState, ChangeEvent } from 'react';
import { CAROUSEL_ITEMS } from '../consts';
import Button from './Button';

interface CarouselItem {
  image: string;
  name: string;
  floor: string;
}

const CarouselUploader: React.FC = () => {
  const [carouselItems, setCarouselItems] = useState<CarouselItem[]>(CAROUSEL_ITEMS);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = () => {
    if (selectedFile) {
      const newItem: CarouselItem = {
        image: URL.createObjectURL(selectedFile),
        name: selectedFile.name.split('.')[0],
        floor: '0.03ETH',
      };
      setCarouselItems(prevItems => [...prevItems, newItem]);
      setSelectedFile(null);
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm">
      <div className="flex items-center gap-4 mb-6">
        <label className="block">
          <span className="sr-only">Choose NFT image</span>
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-gray-50 file:text-gray-700
              hover:file:bg-gray-100"
          />
        </label>
        <Button 
          onClick={handleSubmit} 
          disabled={!selectedFile}
          variant="primary"
        >
          Upload
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {carouselItems.map((item, index) => (
          <div key={index} className="group relative overflow-hidden rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow">
            <div className="aspect-square overflow-hidden">
              <img 
                src={item.image} 
                alt={item.name} 
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
              />
            </div>
            <div className="p-4">
              <h3 className="font-medium text-gray-900 truncate">{item.name}</h3>
              <p className="text-sm text-gray-500 mt-1">Floor: {item.floor}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CarouselUploader;