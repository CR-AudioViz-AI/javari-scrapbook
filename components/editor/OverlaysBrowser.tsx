                  }}
                />
              </div>
              
              {/* Overlay Name */}
              <p className="text-xs font-medium text-gray-700 text-center truncate">
                {overlay.name}
              </p>
            </button>
          ))}
        </div>

        {filteredOverlays.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Layers2 className="w-12 h-12 mx-auto mb-2 opacity-30" />
            <p className="text-sm">No overlays found</p>
          </div>
        )}
      </div>
    </div>
  );
}
