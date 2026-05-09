import svgPaths from './svg-cm0943ur2i';

export default function Frame() {
  return (
    <div className="content-stretch flex gap-[12px] items-center relative size-full">
      <div
        className="bg-[#fa7319] content-stretch flex gap-[8px] items-center overflow-clip p-[8px] relative rounded-[8px] shrink-0 w-[390px]"
        data-name="Alert & Notification & Toast [1.1]"
      >
        <div className="overflow-clip relative shrink-0 size-[16px]" data-name="alert-fill">
          <div className="absolute inset-[14.58%_12.5%_18.75%_12.5%]" data-name="Vector">
            <svg
              className="absolute block inset-0 size-full"
              fill="none"
              preserveAspectRatio="none"
              viewBox="0 0 12 10.6667"
            >
              <path d={svgPaths.p28d1a6c0} fill="var(--fill-0, white)" id="Vector" />
            </svg>
          </div>
        </div>
        <p
          className="flex-[1_0_0] font-['Geist:Regular',sans-serif] font-normal h-full leading-[16px] min-w-px relative text-[12px] text-white"
          style={{ fontFeatureSettings: "'ss11', 'calt' 0, 'liga' 0" }}
        >
          Insert your alert title here!
        </p>
        <div
          className="content-stretch flex gap-[4px] items-center justify-center relative shrink-0"
          data-name="Link Buttons [1.1]"
        >
          <p
            className="[text-decoration-skip-ink:none] decoration-solid font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[12px] text-white underline whitespace-nowrap"
            style={{ fontFeatureSettings: "'cv09', 'ss11', 'calt' 0, 'liga' 0" }}
          >
            Upgrade
          </p>
        </div>
        <div
          className="opacity-72 overflow-clip relative shrink-0 size-[16px]"
          data-name="close-line"
        >
          <div className="absolute inset-[26.14%_26.13%_26.13%_26.14%]" data-name="Vector">
            <svg
              className="absolute block inset-0 size-full"
              fill="none"
              preserveAspectRatio="none"
              viewBox="0 0 7.6368 7.6368"
            >
              <path d={svgPaths.p1c0b3a00} fill="var(--fill-0, white)" id="Vector" />
            </svg>
          </div>
        </div>
      </div>
      <div
        className="bg-[#ffd9c0] content-stretch flex gap-[8px] items-center overflow-clip p-[8px] relative rounded-[8px] shrink-0 w-[390px]"
        data-name="Alert & Notification & Toast [1.1]"
      >
        <div className="overflow-clip relative shrink-0 size-[16px]" data-name="alert-fill">
          <div className="absolute inset-[14.58%_12.5%_18.75%_12.5%]" data-name="Vector">
            <svg
              className="absolute block inset-0 size-full"
              fill="none"
              preserveAspectRatio="none"
              viewBox="0 0 12 10.6667"
            >
              <path d={svgPaths.p28d1a6c0} fill="var(--fill-0, #FA7319)" id="Vector" />
            </svg>
          </div>
        </div>
        <p
          className="flex-[1_0_0] font-['Geist:Regular',sans-serif] font-normal h-full leading-[16px] min-w-px relative text-[#171717] text-[12px]"
          style={{ fontFeatureSettings: "'ss11', 'calt' 0, 'liga' 0" }}
        >
          Insert your alert title here!
        </p>
        <div
          className="content-stretch flex gap-[4px] items-center justify-center relative shrink-0"
          data-name="Link Buttons [1.1]"
        >
          <p
            className="[text-decoration-skip-ink:none] decoration-solid font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#171717] text-[12px] underline whitespace-nowrap"
            style={{ fontFeatureSettings: "'cv09', 'ss11', 'calt' 0, 'liga' 0" }}
          >
            Upgrade
          </p>
        </div>
        <div
          className="opacity-40 overflow-clip relative shrink-0 size-[16px]"
          data-name="close-line"
        >
          <div className="absolute inset-[26.14%_26.13%_26.13%_26.14%]" data-name="Vector">
            <svg
              className="absolute block inset-0 size-full"
              fill="none"
              preserveAspectRatio="none"
              viewBox="0 0 7.6368 7.6368"
            >
              <path d={svgPaths.p1c0b3a00} fill="var(--fill-0, #171717)" id="Vector" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
