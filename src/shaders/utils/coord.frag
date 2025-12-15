vec2 mosaic(vec2 uv, float n){
    return vec2((floor(uv.x * n) + 0.5) / n, (floor(uv.y * n * 9. / 16.) + 0.5) / (n*9./16.));
}

// UV座標をタイリングする
vec2 tileUV(vec2 uv, float scale) {
    return fract(uv * scale);
}

// UV座標をスケーリングする
vec2 scaleUV(vec2 uv, float scale) {
    return uv * scale;
}

// UV座標を中心を中心に回転する
vec2 rotateUV(vec2 uv, float angle) {
    vec2 center = vec2(0.5, 0.5);
    uv -= center;
    uv = vec2(uv.x * cos(angle) - uv.y * sin(angle), uv.x * sin(angle) + uv.y * cos(angle));
    uv += center;
    return uv;
}

// UV座標をミラー反転する
vec2 mirror(vec2 uv) {
    return vec2(1.0 - uv.x, uv.y);
}

// 万華鏡エフェクト（円形にミラーリングしながら分割）
vec2 kaleidoscope(vec2 uv, float segments, vec2 resolution) {
    // 中心を原点に移動
    uv -= vec2(0.5);
    
    // アスペクト比で正規化（正方形にする）
    float aspect = resolution.x / resolution.y;
    uv.x *= aspect;
    
    // デカルト座標から極座標に変換
    float r = length(uv);
    float angle = atan(uv.y, uv.x);
    
    // 角度を分割数で正規化
    float segmentAngle = PI * 2.0 / segments;
    angle = mod(angle, segmentAngle);
    
    // ミラー効果を追加（各セグメントの半分でミラーリング）
    if (mod(floor(atan(uv.y, uv.x) / segmentAngle), 2.0) > 0.5) {
        angle = segmentAngle - angle;
    }
    
    // 極座標からデカルト座標に変換
    uv = vec2(cos(angle), sin(angle)) * r;
    
    // アスペクト比を元に戻す
    uv.x /= aspect;
    
    // 中心を元に戻す
    uv += vec2(0.5);
    
    return uv;
}