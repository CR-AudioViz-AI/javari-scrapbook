'use client';

import React, { useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import { useScrapbookStore } from '@/lib/store';
import type { PhotoElement, TextElement, ShapeElement, ScrapbookElement } from '@/lib/types';
import { Type, SlidersHorizontal, Box, Image, Layers, ChevronDown, ChevronRight, Move, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, SquareDashed, X } from 'lucide-react';

interface CollapsibleSectionProps { title: string; icon: React.ReactNode; children: React.ReactNode; defaultOpen?: boolean; }
function CollapsibleSection({ title, icon, children, defaultOpen = true }: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center gap-2 p-3 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
        {icon}<span className="flex-1 text-left">{title}</span>{isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
      </button>
      {isOpen && <div className="px-3 pb-3">{children}</div>}
    </div>
  );
}

function NumberInput({ label, value, onChange, min, max, step = 1, unit = '' }: { label: string; value: number; onChange: (v: number) => void; min?: number; max?: number; step?: number; unit?: string; }) {
  return (
    <div className="flex items-center gap-2">
      <label className="text-xs text-gray-500 w-12">{label}</label>
      <input type="number" value={value} onChange={(e) => onChange(parseFloat(e.target.value) || 0)} min={min} max={max} step={step} className="flex-1 px-2 py-1 text-sm bg-gray-100 dark:bg-gray-800 rounded border-0 focus:ring-2 focus:ring-blue-500" />
      {unit && <span className="text-xs text-gray-400 w-6">{unit}</span>}
    </div>
  );
}

function SliderInput({ label, value, onChange, min = 0, max = 100, step = 1 }: { label: string; value: number; onChange: (v: number) => void; min?: number; max?: number; step?: number; }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between"><label className="text-xs text-gray-500">{label}</label><span className="text-xs text-gray-400">{value}</span></div>
      <input type="range" value={value} onChange={(e) => onChange(parseFloat(e.target.value))} min={min} max={max} step={step} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" />
    </div>
  );
}

function ColorPicker({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void; }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        <label className="text-xs text-gray-500 flex-1">{label}</label>
        <button onClick={() => setIsOpen(!isOpen)} className="w-8 h-8 rounded border border-gray-300 dark:border-gray-600 shadow-sm" style={{ backgroundColor: value }} />
      </div>
      {isOpen && (
        <div className="absolute right-0 top-10 z-50 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-3 border border-gray-200 dark:border-gray-700">
          <button onClick={() => setIsOpen(false)} className="absolute top-1 right-1 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"><X className="w-4 h-4" /></button>
          <HexColorPicker color={value} onChange={onChange} />
          <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className="mt-2 w-full px-2 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded text-center" />
        </div>
      )}
    </div>
  );
}

export function PropertiesPanel() {
  const { editor, getSelectedElements, updateElement, getCurrentPage } = useScrapbookStore();
  const selectedElements = getSelectedElements();
  const currentPage = getCurrentPage();
  
  if (selectedElements.length === 0) {
    return (
      <div className="w-64 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700"><h2 className="font-semibold">Properties</h2></div>
        <div className="flex-1 flex items-center justify-center p-4"><p className="text-sm text-gray-500 text-center">Select an element to edit</p></div>
        {currentPage && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium mb-3">Page Info</h3>
            <div className="space-y-2 text-xs text-gray-500"><p>Size: {currentPage.width} × {currentPage.height}px</p><p>Elements: {currentPage.elements.length}</p></div>
          </div>
        )}
      </div>
    );
  }
  
  const element = selectedElements[0];
  const isMultiSelect = selectedElements.length > 1;
  const handleUpdate = (updates: Partial<ScrapbookElement>) => { selectedElements.forEach((el) => updateElement(el.id, updates)); };

  return (
    <div className="w-64 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="font-semibold">Properties</h2>
        <p className="text-xs text-gray-500 mt-1">{isMultiSelect ? `${selectedElements.length} elements selected` : element.name}</p>
      </div>
      <div className="flex-1 overflow-y-auto">
        <CollapsibleSection title="Transform" icon={<Move className="w-4 h-4" />}>
          <div className="grid grid-cols-2 gap-2">
            <NumberInput label="X" value={Math.round(element.position.x)} onChange={(x) => handleUpdate({ position: { ...element.position, x } })} />
            <NumberInput label="Y" value={Math.round(element.position.y)} onChange={(y) => handleUpdate({ position: { ...element.position, y } })} />
            <NumberInput label="W" value={Math.round(element.size.width)} onChange={(width) => handleUpdate({ size: { ...element.size, width } })} min={1} />
            <NumberInput label="H" value={Math.round(element.size.height)} onChange={(height) => handleUpdate({ size: { ...element.size, height } })} min={1} />
          </div>
          <div className="mt-3"><NumberInput label="Rotate" value={element.transform.rotation} onChange={(rotation) => handleUpdate({ transform: { ...element.transform, rotation } })} min={-360} max={360} unit="°" /></div>
        </CollapsibleSection>
        <CollapsibleSection title="Appearance" icon={<SlidersHorizontal className="w-4 h-4" />}>
          <div className="space-y-3"><SliderInput label="Opacity" value={Math.round(element.opacity * 100)} onChange={(v) => handleUpdate({ opacity: v / 100 })} /></div>
        </CollapsibleSection>
        {element.type === 'photo' && (
          <CollapsibleSection title="Photo Filters" icon={<Image className="w-4 h-4" />}>
            <div className="space-y-3">
              <SliderInput label="Brightness" value={(element as PhotoElement).filters.brightness} onChange={(brightness) => handleUpdate({ filters: { ...(element as PhotoElement).filters, brightness } } as Partial<PhotoElement>)} max={200} />
              <SliderInput label="Contrast" value={(element as PhotoElement).filters.contrast} onChange={(contrast) => handleUpdate({ filters: { ...(element as PhotoElement).filters, contrast } } as Partial<PhotoElement>)} max={200} />
              <SliderInput label="Saturation" value={(element as PhotoElement).filters.saturation} onChange={(saturation) => handleUpdate({ filters: { ...(element as PhotoElement).filters, saturation } } as Partial<PhotoElement>)} max={200} />
              <SliderInput label="Grayscale" value={(element as PhotoElement).filters.grayscale} onChange={(grayscale) => handleUpdate({ filters: { ...(element as PhotoElement).filters, grayscale } } as Partial<PhotoElement>)} />
            </div>
          </CollapsibleSection>
        )}
        {element.type === 'text' && (
          <CollapsibleSection title="Typography" icon={<Type className="w-4 h-4" />}>
            <div className="space-y-3">
              <div><label className="text-xs text-gray-500 block mb-1">Font Family</label>
                <select value={(element as TextElement).fontFamily} onChange={(e) => handleUpdate({ fontFamily: e.target.value } as Partial<TextElement>)} className="w-full px-2 py-1 text-sm bg-gray-100 dark:bg-gray-800 rounded border-0 focus:ring-2 focus:ring-blue-500">
                  <option value="Inter">Inter</option><option value="Arial">Arial</option><option value="Georgia">Georgia</option><option value="Times New Roman">Times New Roman</option>
                </select>
              </div>
              <NumberInput label="Size" value={(element as TextElement).fontSize} onChange={(fontSize) => handleUpdate({ fontSize } as Partial<TextElement>)} min={8} max={200} unit="px" />
              <div className="flex gap-1">
                <button onClick={() => handleUpdate({ fontWeight: (element as TextElement).fontWeight === 700 ? 400 : 700 } as Partial<TextElement>)} className={`flex-1 p-2 rounded ${(element as TextElement).fontWeight === 700 ? 'bg-blue-100 dark:bg-blue-900' : 'bg-gray-100 dark:bg-gray-800'}`}><Bold className="w-4 h-4 mx-auto" /></button>
                <button onClick={() => handleUpdate({ fontStyle: (element as TextElement).fontStyle === 'italic' ? 'normal' : 'italic' } as Partial<TextElement>)} className={`flex-1 p-2 rounded ${(element as TextElement).fontStyle === 'italic' ? 'bg-blue-100 dark:bg-blue-900' : 'bg-gray-100 dark:bg-gray-800'}`}><Italic className="w-4 h-4 mx-auto" /></button>
                <button onClick={() => handleUpdate({ textDecoration: (element as TextElement).textDecoration === 'underline' ? 'none' : 'underline' } as Partial<TextElement>)} className={`flex-1 p-2 rounded ${(element as TextElement).textDecoration === 'underline' ? 'bg-blue-100 dark:bg-blue-900' : 'bg-gray-100 dark:bg-gray-800'}`}><Underline className="w-4 h-4 mx-auto" /></button>
              </div>
              <div className="flex gap-1">
                {(['left', 'center', 'right'] as const).map((align) => (
                  <button key={align} onClick={() => handleUpdate({ textAlign: align } as Partial<TextElement>)} className={`flex-1 p-2 rounded ${(element as TextElement).textAlign === align ? 'bg-blue-100 dark:bg-blue-900' : 'bg-gray-100 dark:bg-gray-800'}`}>
                    {align === 'left' && <AlignLeft className="w-4 h-4 mx-auto" />}{align === 'center' && <AlignCenter className="w-4 h-4 mx-auto" />}{align === 'right' && <AlignRight className="w-4 h-4 mx-auto" />}
                  </button>
                ))}
              </div>
              <ColorPicker label="Text Color" value={(element as TextElement).color} onChange={(color) => handleUpdate({ color } as Partial<TextElement>)} />
            </div>
          </CollapsibleSection>
        )}
        {element.type === 'shape' && (
          <CollapsibleSection title="Shape Style" icon={<Box className="w-4 h-4" />}>
            <div className="space-y-3">
              <ColorPicker label="Fill Color" value={(element as ShapeElement).fill} onChange={(fill) => handleUpdate({ fill } as Partial<ShapeElement>)} />
              <ColorPicker label="Stroke Color" value={(element as ShapeElement).stroke} onChange={(stroke) => handleUpdate({ stroke } as Partial<ShapeElement>)} />
              <NumberInput label="Stroke" value={(element as ShapeElement).strokeWidth} onChange={(strokeWidth) => handleUpdate({ strokeWidth } as Partial<ShapeElement>)} min={0} max={20} unit="px" />
            </div>
          </CollapsibleSection>
        )}
        <CollapsibleSection title="Border" icon={<SquareDashed className="w-4 h-4" />} defaultOpen={false}>
          <div className="space-y-3">
            <label className="flex items-center gap-2"><input type="checkbox" checked={element.border.enabled} onChange={(e) => handleUpdate({ border: { ...element.border, enabled: e.target.checked } })} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" /><span className="text-sm">Enable Border</span></label>
            {element.border.enabled && (<><ColorPicker label="Border Color" value={element.border.color} onChange={(color) => handleUpdate({ border: { ...element.border, color } })} /><NumberInput label="Width" value={element.border.width} onChange={(width) => handleUpdate({ border: { ...element.border, width } })} min={1} max={20} unit="px" /><NumberInput label="Radius" value={element.border.radius} onChange={(radius) => handleUpdate({ border: { ...element.border, radius } })} min={0} max={100} unit="px" /></>)}
          </div>
        </CollapsibleSection>
        <CollapsibleSection title="Shadow" icon={<Layers className="w-4 h-4" />} defaultOpen={false}>
          <div className="space-y-3">
            <label className="flex items-center gap-2"><input type="checkbox" checked={element.shadow.enabled} onChange={(e) => handleUpdate({ shadow: { ...element.shadow, enabled: e.target.checked } })} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" /><span className="text-sm">Enable Shadow</span></label>
            {element.shadow.enabled && (<><ColorPicker label="Shadow Color" value={element.shadow.color} onChange={(color) => handleUpdate({ shadow: { ...element.shadow, color } })} /><NumberInput label="Blur" value={element.shadow.blur} onChange={(blur) => handleUpdate({ shadow: { ...element.shadow, blur } })} min={0} max={50} unit="px" /><NumberInput label="X" value={element.shadow.offsetX} onChange={(offsetX) => handleUpdate({ shadow: { ...element.shadow, offsetX } })} min={-50} max={50} unit="px" /><NumberInput label="Y" value={element.shadow.offsetY} onChange={(offsetY) => handleUpdate({ shadow: { ...element.shadow, offsetY } })} min={-50} max={50} unit="px" /></>)}
          </div>
        </CollapsibleSection>
      </div>
    </div>
  );
}

export default PropertiesPanel;
