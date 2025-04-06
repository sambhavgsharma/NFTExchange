import { STATS_TABLE } from '@/consts'
import { useMemo } from 'react'
import { Mousewheel, Navigation } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import Button from './Button'
import Container from './Container'

const commonBiggerScreen = {
  centeredSlides: false,
  centeredSlidesBounds: false,
  spaceBetween: 24,
  slidesOffsetBefore: 0,
  slidesOffsetAfter: 0,
}

export default function CollectionsSection({ title }: { title: string }) {
  const shuffledData = useMemo(() => {
    return STATS_TABLE.sort(() => 0.5 - Math.random())
  }, [])

  return (
    <Container className="py-16">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <Button variant="outline">View All</Button>
      </div>

      <div className="-mx-4 sm:mx-0">
        <Swiper
          modules={[Navigation, Mousewheel]}
          mousewheel={{ invert: false, forceToAxis: true }}
          breakpoints={{
            0: {
              slidesPerView: 'auto',
              slidesPerGroup: 1,
              centeredSlides: true,
              centeredSlidesBounds: true,
              spaceBetween: 16,
              slidesOffsetBefore: 16,
              slidesOffsetAfter: 16,
            },
            600: { slidesPerView: 2, slidesPerGroup: 2, ...commonBiggerScreen },
            768: { slidesPerView: 3, slidesPerGroup: 3, ...commonBiggerScreen },
            1024: { slidesPerView: 4, slidesPerGroup: 4, ...commonBiggerScreen },
            1200: { slidesPerView: 5, slidesPerGroup: 5, ...commonBiggerScreen },
            1600: { slidesPerView: 6, slidesPerGroup: 6, ...commonBiggerScreen },
          }}
          navigation
          className="collections-slide !pb-12"
        >
          {shuffledData.map((item, i) => (
            <SwiperSlide key={i} className="!h-auto">
              <div className="h-full flex flex-col bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="relative aspect-video overflow-hidden">
                  <img 
                    src={`/carousel/${item.image}`} 
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 hover:scale-105" 
                    alt={item.name}
                  />
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="font-semibold text-gray-900 mb-4">{item.name}</h3>
                  
                  <div className="mt-auto">
                    <div className="flex justify-between mb-4">
                      <div>
                        <p className="text-xs text-gray-500">Price</p>
                        <p className="font-medium text-gray-900">{item.floor} ETH</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Volume</p>
                        <p className="font-medium text-gray-900">{item.volume} ETH</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        variant="primary" 
                        className="!px-3 !py-1.5 !text-sm flex-1"
                      >
                        Buy
                      </Button>
                      <Button 
                        variant="secondary" 
                        className="!px-3 !py-1.5 !text-sm flex-1"
                      >
                        Rent
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>          
          ))}
        </Swiper>
      </div>
    </Container>
  )
}