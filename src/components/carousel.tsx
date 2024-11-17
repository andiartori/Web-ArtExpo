import React from 'react';

const Carousel: React.FC = () => {
  return (
    <div className="snap-mandatory snap-x flex overflow-x-auto space-x-4 py-10">
      {/* Slide 1 */}
      <div className="snap-center flex-shrink-0 w-full max-w-[320px]">
        <img
          src="/event1.jpg" // Path gambar di folder public
          alt="Image 1"
          className="w-full h-auto rounded-lg"
        />
      </div>

      {/* Slide 2 */}
      <div className="snap-center flex-shrink-0 w-full max-w-[320px]">
        <img
          src="/event2.jpg" // Path gambar di folder public
          alt="Image 2"
          className="w-full h-auto rounded-lg"
        />
      </div>

      {/* Slide 3 */}
      <div className="snap-center flex-shrink-0 w-full max-w-[320px]">
        <img
          src="/event3.jpg" // Path gambar di folder public
          alt="Image 3"
          className="w-full h-auto rounded-lg"
        />
      </div>

      {/* Slide 4 */}
      <div className="snap-center flex-shrink-0 w-full max-w-[320px]">
        <img
          src="/event4.jpg" // Path gambar di folder public
          alt="Image 4"
          className="w-full h-auto rounded-lg"
        />
      </div>

      {/* Slide 5 */}
      <div className="snap-center flex-shrink-0 w-full max-w-[320px]">
        <img
          src="/event5.jpg" // Path gambar di folder public
          alt="Image 5"
          className="w-full h-auto rounded-lg"
        />
      </div>

    </div>
  );
};

export default Carousel;
