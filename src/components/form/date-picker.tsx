// import { useEffect, useRef } from 'react';
// import flatpickr from 'flatpickr';
// import 'flatpickr/dist/flatpickr.css';
// import Label from './Label';
// import { CalenderIcon } from '../../icons';
// import Hook = flatpickr.Options.Hook;
// import DateOption = flatpickr.Options.DateOption;

// type PropsType = {
//   id: string;
//   mode?: "single" | "multiple" | "range" | "time";
//   // onChange?: Hook | Hook[];
//   onChange?: (selectedDates: string[], dateStr: string, instance: flatpickr.Instance) => void
//     | ((selectedDates: string[], dateStr: string, instance: flatpickr.Instance) => void)[];
//   defaultDate?: DateOption;
//   label?: string;
//   placeholder?: string;
//   disabled?: boolean;
// };

// export default function DatePicker({
//   id,
//   mode,
//   onChange,
//   label,
//   defaultDate,
//   placeholder,
//   disabled
// }: PropsType) {
//   const inputRef = useRef<HTMLInputElement | null>(null);
//   const fpInstance = useRef<flatpickr.Instance | null>(null);

//   useEffect(() => {
//     if (inputRef.current) {
//       fpInstance.current = flatpickr(inputRef.current, {
//         mode: mode || "single",
//         static: true,
//         monthSelectorType: "static",
//         dateFormat: "Y-m-d",
//         defaultDate,


//         // onChange: (selectedDates, _dateStr, instance) => {
//         //   const date = selectedDates[0];

//         //   if (date && onChange) {
//         //     const year = date.getFullYear();
//         //     const month = String(date.getMonth() + 1).padStart(2, '0');
//         //     const day = String(date.getDate()).padStart(2, '0');
//         //     const formattedDate = `${year}-${month}-${day}`;
//         //     const formattedDateArray: DateOption[] = [formattedDate];

//         //     if (Array.isArray(onChange)) {
//         //       onChange.forEach(fn => fn(formattedDateArray, formattedDate, instance));
//         //     } else {
//         //       onChange(formattedDateArray, formattedDate, instance);
//         //     }
//         //   }
//         // }

//         // onChange: (selectedDates, dateStr, instance) => {
//         //   if (onChange) {
//         //     if (Array.isArray(onChange)) {
//         //       onChange.forEach(fn => fn(selectedDates, dateStr, instance));
//         //     } else {
//         //       onChange(selectedDates, dateStr, instance);
//         //     }
//         //   }
//         // }

//         onChange: (selectedDates, _dateStr, instance) => {
//           const date = selectedDates[0];

//           if (date && onChange) {
//             // Format the date manually to avoid timezone shifts
//             const year = date.getFullYear();
//             const month = String(date.getMonth() + 1).padStart(2, '0');
//             const day = String(date.getDate()).padStart(2, '0');
//             const formattedDate = `${year}-${month}-${day}`;

//             // Flatpickr expects arrays for multi-mode
//             // const formattedDateArray: DateOption[] = [formattedDate];
//             const formattedDateArray: string[] = [formattedDate];


//             if (Array.isArray(onChange)) {
//               onChange.forEach(fn => fn(formattedDateArray, formattedDate, instance));
//             } else {
//               onChange(formattedDateArray, formattedDate, instance);
//             }
//           }
//         }

//       });
//     }

//     return () => {
//       fpInstance.current?.destroy();
//       fpInstance.current = null;
//     };
//   }, [mode, onChange, defaultDate]);

//   useEffect(() => {
//     if (fpInstance.current && defaultDate) {
//       fpInstance.current.setDate(defaultDate, false);
//     }
//   }, [defaultDate]);

//   return (
//     <div>
//       {label && <Label htmlFor={id}>{label}</Label>}
//       <div className="relative">
//         <input
//           ref={inputRef}
//           id={id}
//           placeholder={placeholder}
//           disabled={disabled}
//           className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:focus:border-brand-800"
//         />
//         <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
//           <CalenderIcon className="size-6" />
//         </span>
//       </div>
//     </div>
//   );
// }




import { useEffect, useRef } from 'react';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.css';
import Label from './Label';
import { CalenderIcon } from '../../icons';
import DateOption = flatpickr.Options.DateOption;

type PropsType = {
  id: string;
  mode?: "single" | "multiple" | "range" | "time";
  onChange?:
  | ((selectedDates: string[], dateStr: string, instance: flatpickr.Instance) => void)
  | ((date: string) => void)
  | (((selectedDates: string[], dateStr: string, instance: flatpickr.Instance) => void)[]);
  defaultDate?: DateOption;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
};

export default function DatePicker({
  id,
  mode,
  onChange,
  label,
  defaultDate,
  placeholder,
  disabled
}: PropsType) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const fpInstance = useRef<flatpickr.Instance | null>(null);

  useEffect(() => {
    if (inputRef.current) {
      fpInstance.current = flatpickr(inputRef.current, {
        mode: mode || "single",
        static: true,
        monthSelectorType: "static",
        dateFormat: "Y-m-d",
        defaultDate,

        onChange: (selectedDates, _dateStr, instance) => {
          const date = selectedDates[0];

          if (date && onChange) {
            // Format the date manually to avoid timezone issues
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const formattedDate = `${year}-${month}-${day}`;

            // --- Flexible onChange support ---
            if (typeof onChange === 'function' && onChange.length === 1) {
              // Support (date: string) => void
              (onChange as (date: string) => void)(formattedDate);
              return;
            }

            // Support Flatpickr-style callbacks
            const formattedDateArray: string[] = [formattedDate];
            if (Array.isArray(onChange)) {
              onChange.forEach(fn => fn(formattedDateArray, formattedDate, instance));
            } else {
              (onChange as (
                selectedDates: string[],
                dateStr: string,
                instance: flatpickr.Instance
              ) => void)(formattedDateArray, formattedDate, instance);
            }
          }
        }
      });
    }

    return () => {
      fpInstance.current?.destroy();
      fpInstance.current = null;
    };
  }, [mode, onChange, defaultDate]);

  useEffect(() => {
    if (fpInstance.current && defaultDate) {
      fpInstance.current.setDate(defaultDate, false);
    }
  }, [defaultDate]);

  return (
    <div>
      {label && <Label htmlFor={id}>{label}</Label>}
      <div className="relative">
        <input
          ref={inputRef}
          id={id}
          placeholder={placeholder}
          disabled={disabled}
          className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:focus:border-brand-800"
        />
        <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
          <CalenderIcon className="size-6" />
        </span>
      </div>
    </div>
  );
}
