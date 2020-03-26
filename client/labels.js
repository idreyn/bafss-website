const labels = {
    materials: 'materials',
    labor: 'labor',
    tools: 'tools',
    three_dee_printing: '3D printing',
    assembly: 'assembly',
    transport: 'transport',
    poly_sheets: 'poly sheets',
    elastic_bands: 'elastic bands',
    pla_filament: 'PLA filament',
    super_glue: 'super glue',
    rubbing_alcohol: 'rubbing alcohol',
    hole_punch: 'hole punch',
    razor_blade_etc: 'razor blades/cutting utilities',
    safety_mask: 'safety masks for mask assembly',
    funding: 'funding',
    money: 'money',
};

export const label = (key, capitalize) => {
    const val = labels[key] || key;
    if (val) {
        if (capitalize) {
            return val.charAt(0).toUpperCase() + val.slice(1);
        }
        return val;
    }
    return '';
};
