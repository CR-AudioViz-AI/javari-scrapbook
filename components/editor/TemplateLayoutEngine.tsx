.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="p-2 border-b overflow-x-auto">
        <div className="flex gap-1">
          {CATEGORIES.map(cat => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Icon className="w-3 h-3" />
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Templates Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-2 gap-3">
          {filteredTemplates.map(template => (
            <button
              key={template.id}
              onClick={() => handleTemplateSelect(template)}
              className="group p-3 rounded-xl border hover:border-blue-300 hover:shadow-md transition-all bg-white"
            >
              {/* Layout Preview */}
              <div 
                className="aspect-square mb-2 relative rounded-lg overflow-hidden"
                style={{ backgroundColor: template.backgroundColor || '#F3F4F6' }}
              >
                {template.slots.filter(s => s.type === 'photo').map(slot => (
                  <div
                    key={slot.id}
                    className="absolute bg-blue-200 border border-blue-300 flex items-center justify-center"
                    style={{
                      left: `${slot.x}%`,
                      top: `${slot.y}%`,
                      width: `${slot.width}%`,
                      height: `${slot.height}%`,
                      transform: slot.rotation ? `rotate(${slot.rotation}deg)` : undefined,
                      borderRadius: slot.borderRadius ? `${slot.borderRadius}px` : undefined,
                      zIndex: slot.zIndex || 1
                    }}
                  >
                    <Image className="w-4 h-4 text-blue-400" />
                  </div>
                ))}
              </div>
              
              {/* Template Info */}
              <div className="text-left">
                <p className="text-sm font-medium text-gray-900">{template.name}</p>
                <p className="text-xs text-gray-500">{template.photoCount} photo{template.photoCount !== 1 ? 's' : ''}</p>
              </div>
            </button>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <LayoutGrid className="w-12 h-12 mx-auto mb-2 opacity-30" />
            <p className="text-sm">No layouts found</p>
          </div>
        )}
      </div>
    </div>
  );
}
